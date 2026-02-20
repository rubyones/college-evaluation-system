import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

let jwt: any = null;

async function loadJWT() {
  if (!jwt) {
    const jwtModule = await import('jsonwebtoken');
    jwt = jwtModule.default || jwtModule;
  }
  return jwt;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'unknown';
}

async function generateToken(userId: number, role: string): Promise<string> {
  const jwtLib = await loadJWT();
  return jwtLib.sign(
    { userId, role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );
}

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const userAgent = request.headers.get('user-agent') || '';

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'email-login') {
      return await handleEmailLogin(body, clientIp, userAgent);
    }

    if (action === 'google-login') {
      return await handleGoogleLogin(body, clientIp, userAgent);
    }

    if (action === 'signup') {
      return await handleSignup(body, clientIp, userAgent);
    }

    if (action === 'logout') {
      return await handleLogout(body, clientIp, userAgent);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleEmailLogin(
  body: any,
  clientIp: string,
  userAgent: string
) {
  try {
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Query database for user
    const users = await query(
      'SELECT id, name, email, role FROM users WHERE email = ? AND password = ?',
      [email, password] // TODO: Use bcrypt for password hashing in production
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];
    const token = await generateToken(user.id, user.role);
    
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
          success: true,
          user: { id: acct.id, name: acct.name, email, role: acct.role },
          token: demoToken,
          message: 'Demo login',
        });
      }
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Query database for user
    const user: any = await queryOne(
      'SELECT id, email, first_name, last_name, role FROM users WHERE email = ? AND is_active = 1',
      [email]
    );

    if (!user) {
      // Demo fallback - allow demo login with any @jmc.edu.ph email
      if (password === 'demo') {
        const nameParts = email.split('@')[0].split('.');
        const firstName = nameParts[0]?.charAt(0).toUpperCase() + nameParts[0]?.slice(1) || 'User';
        const lastName = nameParts[1]?.charAt(0).toUpperCase() + nameParts[1]?.slice(1) || 'Account';
        const demoToken = await generateToken(999, 'student');
        
        return NextResponse.json({
          success: true,
          user: {
            id: 999,
            name: `${firstName} ${lastName}`,
            email: email,
            role: 'student',
          },
          token: demoToken,
          message: 'Demo login - data not persisted',
        });
      }

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // TODO: Implement actual password hashing verification
    // For now, accept "demo" as password for database users too
    if (password !== 'demo') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token with real user data
    const token = await generateToken(user.id, user.role);

    // Log login to audit
    await query(
      'INSERT INTO audit_logs (user_id, action, description, ip_address, user_agent, status) VALUES (?, ?, ?, ?, ?, ?)',
      [user.id, 'LOGIN', 'User login via email', clientIp, userAgent, 'success']
    );

    // Create session record
    await query(
      'INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at) VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))',
      [user.id, token, clientIp, userAgent]
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Email login error:', error);
    return NextResponse.json(
      { error: 'Login failed', details: String(error) },
      { status: 500 }
    );
  }
}

async function handleGoogleLogin(
  body: any,
  clientIp: string,
  userAgent: string
) {
  try {
    const { googleToken } = body;

    if (!googleToken) {
      return NextResponse.json(
        { error: 'Google token is required' },
        { status: 400 }
      );
    }

    // For demo mode - use test user
    const email = 'test.user@jmc.edu.ph';
    const firstName = 'Test';
    const lastName = 'User';
    const userId = 1;

    // Verify email domain
    if (!email.endsWith('@jmc.edu.ph')) {
      return NextResponse.json(
        { error: 'Access denied. Please use your official JMC institutional account.' },
        { status: 403 }
      );
    }

    // Generate token
    const token = await generateToken(userId, 'student');

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: `${firstName} ${lastName}`,
        email: email,
        role: 'student',
      },
      token,
    });
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json(
      { error: 'Login failed', details: String(error) },
      { status: 500 }
    );
  }
}

async function handleSignup(
  body: any,
  clientIp: string,
  userAgent: string
) {
  try {
    const { email, firstName, lastName, jmcId, password, role } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !jmcId || !password || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (role === 'dean') {
      return NextResponse.json(
        { error: 'Dean accounts cannot be created through signup' },
        { status: 403 }
      );
    }

    // Verify email domain
    if (!email.endsWith('@jmc.edu.ph')) {
      return NextResponse.json(
        { error: 'Please use your official JMC institutional email' },
        { status: 400 }
      );
    }

    // Demo mode - accept signup
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Signup failed', details: String(error) },
      { status: 500 }
    );
  }
}

async function handleLogout(
  body: any,
  clientIp: string,
  userAgent: string
) {
  try {
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Demo mode - accept logout
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed', details: String(error) },
      { status: 500 }
    );
  }
}
