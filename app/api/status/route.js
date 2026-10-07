import { handleStatus } from '../../../lib/chat.js';

export const dynamic = 'force-dynamic';

export function GET(request) {
  return handleStatus(request, process.env);
}

export function POST(request) {
  return handleStatus(request, process.env);
}