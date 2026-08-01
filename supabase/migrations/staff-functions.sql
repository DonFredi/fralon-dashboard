-- ─────────────────────────────────────────────────────────────────
-- STAFF MODULE — SQL functions and policies
-- Run this in your Supabase SQL editor before using the staff module
-- ─────────────────────────────────────────────────────────────────


-- ── 1. Promote a customer to staff ───────────────────────────────
CREATE OR REPLACE FUNCTION promote_to_staff(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- caller must be admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can promote staff';
  END IF;

  -- cannot promote yourself
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot promote yourself';
  END IF;

  -- target must be a customer — prevents accidental double-promotion
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = target_user_id AND role = 'customer'
  ) THEN
    RAISE EXCEPTION 'Target user must be a customer to be promoted to staff';
  END IF;

  UPDATE profiles
  SET role = 'staff', updated_at = now()
  WHERE id = target_user_id;
END;
$$;


-- ── 2. Demote a staff member back to customer ─────────────────────
CREATE OR REPLACE FUNCTION demote_to_customer(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- caller must be admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can demote staff';
  END IF;

  -- target must currently be staff
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = target_user_id AND role = 'staff'
  ) THEN
    RAISE EXCEPTION 'Target user must be a staff member to be demoted';
  END IF;

  UPDATE profiles
  SET role = 'customer', updated_at = now()
  WHERE id = target_user_id;
END;
$$;


-- ── 3. Activate or deactivate a staff member ─────────────────────
CREATE OR REPLACE FUNCTION set_staff_active(target_user_id UUID, active BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- caller must be admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can change staff active status';
  END IF;

  -- target must be staff
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = target_user_id AND role = 'staff'
  ) THEN
    RAISE EXCEPTION 'Target user must be a staff member';
  END IF;

  UPDATE profiles
  SET is_active = active, updated_at = now()
  WHERE id = target_user_id;
END;
$$;


-- ── 4. RLS — admin can read staff profiles ────────────────────────
-- Note: "admin can read all profiles" policy already exists from
-- earlier setup and covers staff profiles. If you haven't added
-- it yet, run this:

-- CREATE POLICY "admin can read all profiles"
-- ON profiles FOR SELECT
-- USING (
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE id = auth.uid()
--     AND role = 'admin'
--   )
-- );


-- ── 5. Staff cannot read other staff or admin profiles ────────────
-- The existing "allow authenticated users to read own profile"
-- policy correctly limits staff to reading only their own profile.
-- No additional policy needed here.
