import ActivityLog from '../models/ActivityLog.js';

// Log an activity (fire-and-forget)
export const logActivity = async (userId, action, entity, entityId = null, details = '', ipAddress = '') => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      entity,
      entityId,
      details,
      ipAddress
    });
  } catch (error) {
    // Don't throw - logging failures shouldn't break the app
    console.error('Activity logging failed:', error.message);
  }
};

export default logActivity;
