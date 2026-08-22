import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { checkAdminSession } from '@/app/hq-management-system/auth-actions';
import { studySchema } from '@/lib/schemas';
import { getValidationErrorMessage } from '@/lib/validation-error';
import { parseNumericId } from '@/lib/validate-id';

export async function GET() {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from('studies')
    .select('*')
    .order('published_date', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rawBody = await req.json();
    const validatedBody = studySchema.parse(rawBody);
    const { data, error } = await supabaseAdmin.from('studies').insert([validatedBody]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: getValidationErrorMessage(err) }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const rawBody = await req.json();
    const { id, ...rest } = rawBody;
    const numericId = parseNumericId(id);
    if (!numericId) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const validatedBody = studySchema.parse(rest);
    const { data, error } = await supabaseAdmin.from('studies').update(validatedBody).eq('id', numericId).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: getValidationErrorMessage(err) }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from('studies').delete().eq('id', Number(id));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
