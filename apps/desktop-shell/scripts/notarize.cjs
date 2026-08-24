const { notarize } = require("@electron/notarize");

exports.default = async function notarizeMac(context) {
  const { electronPlatformName, appOutDir, packager } = context;
  if (electronPlatformName !== "darwin") return;
  const appleId = process.env.APPLE_ID;
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD;
  const teamId = process.env.APPLE_TEAM_ID;
  if (!appleId || !appleIdPassword || !teamId) throw new Error("Apple notarization secrets are required for macOS release.");
  await notarize({ appPath: `${appOutDir}/${packager.appInfo.productFilename}.app`, appleId, appleIdPassword, teamId });
};
