const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://your-project-url.supabase.co',
  'your-anon-key'
);

const createAdmin = async () => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'babayev1994@gmail.com',
      password: '12345678'
    });

    if (error) {
      console.error('Error creating admin:', error.message);
      return;
    }

    console.log('Admin created successfully:', data);
  } catch (err) {
    console.error('System error:', err);
  }
};

createAdmin();
