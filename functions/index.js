const {onSchedule} = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// 🔄 Cleanup job: runs every 10 minutes
exports.cleanupExpiredSessions = onSchedule(
    "every 10 minutes",
    async (event) => {
      const now = new Date();
      const expiredRef = db
          .collection("sessions")
          .where("expiresAt", "<=", now);

      const snapshot = await expiredRef.get();

      if (snapshot.empty) {
        console.log("✅ No expired sessions found.");
        return null;
      }

      // Use batch to delete
      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`🗑 Deleted ${snapshot.size} expired sessions at ${now}`);

      return null;
    },
);
