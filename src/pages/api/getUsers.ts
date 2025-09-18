import { adminDb } from "../../lib/firebase/admin";

export async function GET() {
  try {
    const snapshot = await adminDb.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error fetching users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
