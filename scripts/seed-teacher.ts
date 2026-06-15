/**
 * Seeds the single administrator account in Supabase.
 *
 * Default credentials:
 *   Email:    admin@mdt.com
 *   Password: Admin123!
 *
 * Usage:
 *   npm run seed:admin
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL || "admin@mdt.com";
const password = process.env.ADMIN_PASSWORD || "Admin123!";

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedAdmin() {
  console.log(`Seeding administrator account: ${email}`);

  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);

  let userId: string;

  if (existing) {
    console.log("Admin user already exists, syncing teacher record.");
    userId = existing.id;

    await supabase.auth.admin.updateUserById(userId, { password });
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error || !data.user) {
      console.error("Failed to create admin user:", error?.message);
      process.exit(1);
    }

    userId = data.user.id;
    console.log("Auth user created.");
  }

  const { error: teacherError } = await supabase.from("teachers").upsert(
    {
      id: userId,
      email,
      role: "admin",
    },
    { onConflict: "id" }
  );

  if (teacherError) {
    console.error("Failed to create admin record:", teacherError.message);
    process.exit(1);
  }

  console.log("Administrator account ready.");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Login:    /teacher`);
}

seedAdmin();
