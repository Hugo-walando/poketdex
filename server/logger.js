const logError = (message, error) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ❌ ${message}:`, error?.message || error);
};

const logInfo = (message) => {
  if (process.env.NODE_ENV === 'production') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ℹ️ ${message}`);
  }
};

module.exports = {
  logError,
  logInfo,
};
