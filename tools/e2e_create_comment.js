(async ()=>{
  const ts = Date.now();
  const email = `e2e.user+${ts}@jmc.edu.ph`;

  try {
    const signupRes = await fetch('http://localhost:3002/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'signup',
        email,
        firstName: 'E2E',
        lastName: 'User',
        jmcId: 'E2E' + ts,
        password: 'testpass',
        role: 'student',
      }),
    });

    const signupData = await signupRes.json();
    console.log('SIGNUP_STATUS', signupRes.status);
    console.log(JSON.stringify(signupData));

    if (!signupData?.token) {
      console.error('No token returned');
      process.exit(1);
    }

    const token = signupData.token;
    const commentText = `E2E test comment ${ts}`;

    const commentRes = await fetch('http://localhost:3002/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ entity_type: 'course', entity_id: 'course-1', content: commentText }),
    });

    const commentData = await commentRes.json();
    console.log('COMMENT_STATUS', commentRes.status);
    console.log(JSON.stringify(commentData));
  } catch (e) {
    console.error('ERR', e);
    process.exit(1);
  }
})();
