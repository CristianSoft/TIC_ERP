import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp();
const db = admin.firestore();
// Helper function to get document ID by email

/**
 * Get document ID by email
 * @param {string} email - The email to search for.
 * @return {Promise<string|null>} The document ID or null if not found.
 */
async function getDocumentIdByEmail(email: string) {
  const usuariosRef = db.collection("usuarios");
  const q = usuariosRef.where("email", "==", email);
  const snapshot = await q.get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return null;
  }

  let documentId;
  snapshot.forEach((doc) => {
    documentId = doc.id; // Assuming there's only one document with this email
  });

  return documentId;
}

export const addUserRole = functions.https.onCall(async (data, context) => {
  try {
    // Agregar el role al claim del usuario
    const user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, {role: data.role});

    return {message: `Role ${data.role} Added!`};
  } catch (error) {
    // Manejar errores si ocurren
    console.error("Error adding role:", error);
    throw new functions.https.HttpsError("unknown", "Error adding role ");
  }
});

export const updateAdministrativeMemberRole = functions.https.onCall(
  async (data, context) => {
    try {
      const docId = await getDocumentIdByEmail(data.email);

      if (!docId) {
        throw new functions.https.HttpsError(
          "not-found",
          "No matching documents found."
        );
      }

      const userRef = db.collection("usuarios").doc(docId);
      await userRef.update({role: data.position});

      const user = await admin.auth().getUserByEmail(data.email);
      await admin.auth().setCustomUserClaims(user.uid, {role: data.position});

      return {message: "Role Actualizado correctamente"};
    } catch (error) {
      throw new functions.https.HttpsError(
        "unknown",
        "Falla al actualizar el rol",
        error
      );
    }
  }
);

export const registerUser = functions.https.onCall(async (data, context) => {
  try {
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
    });

    await db.collection("usuarios").doc(userRecord.uid).set({
      email: data.email,
      role: data.role,
    });

    // Add custom claims
    await admin.auth().setCustomUserClaims(userRecord.uid, {role: data.role});

    return {uid: userRecord.uid, email: userRecord.email, role: data.role};
  } catch (error) {
    console.error("Error al crear un nuevo usuario:", error);
    throw new functions.https.HttpsError(
      "unknown",
      "Falla al crear usuario",
      error
    );
  }
});


