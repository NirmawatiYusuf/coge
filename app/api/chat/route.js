import { handleChat } from '../../../lib/chat.js';

export const dynamic = 'force-dynamic';

export function POST(request) {
  return handleChat(request, process.env);
}

export function GET(request) {
  return handleChat(request, process.env);
}