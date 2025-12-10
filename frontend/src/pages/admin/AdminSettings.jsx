import React, { useState, useEffect } from "react";
import { Settings, Shield, Save, AlertCircle, Info } from "lucide-react";
import { toast } from "react-toastify";
import authService from "../../services/authService";

const Toggle = ({ checked, onChange, id }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        checked ? "bg-blue-600 focus:ring-blue-500" : "bg-gray-200 focus:ring-gray-500"
      }`}
      role="switch"
      aria-checked={checked}
      aria-labelledby={id}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState("general");
  const [saving, setSaving] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState(() => {
    const saved = localStorage.getItem("admin_generalSettings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {
          siteName: "Connectify",
          siteDescription: "Social Media Platform",
          maintenanceMode: false,
        };
      }
    }
    return {
      siteName: "Connectify",
      siteDescription: "Social Media Platform",
      maintenanceMode: false,
    };
  });

  const [securitySettings, setSecuritySettings] = useState(() => {
    const saved = localStorage.getItem("admin_securitySettings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {
          sessionTimeout: 30,
          passwordMinLength: 8,
          requireStrongPassword: true,
        };
      }
    }
    return {
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireStrongPassword: true,
    };
  });

  const handleGeneralSave = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("admin_generalSettings", JSON.stringify(generalSettings));
      
      toast.success("General settings saved successfully");
    } catch (error) {
      toast.error("Failed to save general settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySave = async () => {
    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("admin_securitySettings", JSON.stringify(securitySettings));
      localStorage.setItem("sessionTimeout", JSON.stringify(securitySettings.sessionTimeout));
      localStorage.setItem("passwordMinLength", JSON.stringify(securitySettings.passwordMinLength));
      localStorage.setItem("requireStrongPassword", JSON.stringify(securitySettings.requireStrongPassword));
      toast.success("Security settings saved successfully");
    } catch (error) {
      toast.error("Failed to save security settings");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const savedSettings = localStorage.getItem("admin_securitySettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSecuritySettings(parsed);
        localStorage.setItem("sessionTimeout", JSON.stringify(parsed.sessionTimeout || 30));
        localStorage.setItem("passwordMinLength", JSON.stringify(parsed.passwordMinLength || 8));
        localStorage.setItem("requireStrongPassword", JSON.stringify(parsed.requireStrongPassword !== false));
      } catch (e) {
        console.error("Error loading security settings:", e);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
          <Info size={18} className="text-blue-600" />
          <span>Settings are saved automatically. Changes take effect immediately.</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-2 border-b">
          <button
            onClick={() => setActiveSection("general")}
            className={`px-4 py-2 rounded-t-lg font-medium transition ${
              activeSection === "general"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings size={18} />
              General
            </div>
          </button>
          <button
            onClick={() => setActiveSection("security")}
            className={`px-4 py-2 rounded-t-lg font-medium transition ${
              activeSection === "security"
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={18} />
              Security
            </div>
          </button>
        </div>
      </div>

      {activeSection === "general" && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">General Settings</h3>
            <p className="text-sm text-gray-600 mt-1">Manage basic platform configuration and maintenance mode</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={generalSettings.siteName}
                onChange={(e) =>
                  setGeneralSettings({ ...generalSettings, siteName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter site name"
              />
              <p className="text-xs text-gray-500 mt-1">
                This name will be displayed in the browser tab and throughout the platform
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={generalSettings.siteDescription}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    siteDescription: e.target.value,
                  })
                }
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter site description"
              />
              <p className="text-xs text-gray-500 mt-1">
                Brief description of your platform (used in meta tags and SEO)
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Maintenance Mode</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    <strong>What happens when Maintenance Mode is ON:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>All regular users will see a "Site Under Maintenance" message</li>
                    <li>Users cannot access Feed, Messages, Friends, or any user features</li>
                    <li>Only Admins can still access the admin dashboard</li>
                    <li>New user registrations will be temporarily disabled</li>
                    <li>Existing sessions will be logged out (except admins)</li>
                    <li>This is useful for platform updates, bug fixes, or server maintenance</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-yellow-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enable Maintenance Mode
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Turn this ON to restrict access to the platform
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const newMaintenanceMode = !generalSettings.maintenanceMode;
                    const updatedSettings = {
                      ...generalSettings,
                      maintenanceMode: newMaintenanceMode,
                    };
                    setGeneralSettings(updatedSettings);
                    
                    localStorage.setItem("admin_generalSettings", JSON.stringify(updatedSettings));
                    localStorage.setItem("maintenanceMode", JSON.stringify(newMaintenanceMode));
                    
                    if (newMaintenanceMode) {
                      toast.success("Maintenance mode enabled. Regular users will be blocked.");
                    } else {
                      toast.success("Maintenance mode disabled. All users can access the platform.");
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                    generalSettings.maintenanceMode ? "bg-yellow-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      generalSettings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleGeneralSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {activeSection === "security" && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
            <p className="text-sm text-gray-600 mt-1">Configure platform security and authentication requirements</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={securitySettings.sessionTimeout}
                onChange={(e) =>
                  setSecuritySettings({
                    ...securitySettings,
                    sessionTimeout: parseInt(e.target.value) || 30,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                <strong>What it does:</strong> Automatically logs users out after X minutes of inactivity. 
                <strong> When set to 30:</strong> Users will be logged out if they don't interact with the platform for 30 minutes. 
                This helps protect accounts from unauthorized access if someone leaves their device unattended.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Password Length
              </label>
              <input
                type="number"
                min="6"
                max="32"
                value={securitySettings.passwordMinLength}
                onChange={(e) =>
                  setSecuritySettings({
                    ...securitySettings,
                    passwordMinLength: parseInt(e.target.value) || 8,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                <strong>What it does:</strong> Requires all new passwords to be at least this many characters long.
                <strong> When set to 8:</strong> Users must create passwords with minimum 8 characters. Longer passwords are more secure.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Require Strong Password
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>What it does:</strong> Enforces password complexity rules requiring uppercase, lowercase, numbers, and special characters.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    <strong>When ON:</strong> Passwords must contain: At least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*). Makes passwords harder to guess or crack.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securitySettings.requireStrongPassword}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        requireStrongPassword: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleSecuritySave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition shadow-md hover:shadow-lg font-medium disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSettings;
