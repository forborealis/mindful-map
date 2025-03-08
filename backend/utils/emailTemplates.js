const deactivationNoticeTemplate = (loginUrl) => `
  <p>Your account will be disabled in 24 hours unless you log in.</p>
  <p>To keep your account active, please log in within the next 24 hours.</p>
  <a href="${loginUrl}" 
    style="background-color:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
    Log In
  </a>
`;

const accountDisabledTemplate = (reactivationUrl) => `
  <p>Your account has been disabled.</p>
  <p>To reactivate your account, please click the button below:</p>
  <a href="${reactivationUrl}" 
    style="background-color:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
    Send Request
  </a>
`;

const accountReactivatedTemplate = (loginUrl) => `
  <p>Your account has been reactivated by an administrator.</p>
  <p>You can now log in again: <a href="${loginUrl}">Login</a></p>
`;

module.exports = {
  deactivationNoticeTemplate,
  accountDisabledTemplate,
  accountReactivatedTemplate
};