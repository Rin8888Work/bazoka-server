module.exports = {
  screensDefault: [
    {
      name: "Administrator",
      code: "ADMINISTRATOR",
      roleAccess: ["ADMIN"],
      licenseAccess: ["FREE", "PAID"],
      order: 1,
      children: [
        {
          name: "Role",
          code: "ROLE",
          screenPath: "/admin/role",
          roleAccess: ["ADMIN"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "Function",
          code: "FUNCTION",
          screenPath: "/admin/function",
          roleAccess: ["ADMIN"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "License",
          code: "LICENSE",
          screenPath: "/admin/license",
          roleAccess: ["ADMIN"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "Screen",
          code: "SCREEN",
          screenPath: "/admin/screen",
          roleAccess: ["ADMIN", "USER"],
          licenseAccess: ["FREE", "PAID"],
        },
      ],
    },
    {
      name: "Tổng quan",
      order: 2,

      code: "HOME",
      screenPath: "/",
      roleAccess: ["ADMIN", "USER"],
      licenseAccess: ["FREE", "PAID"],
    },
    {
      name: "Download",
      code: "DOWNLOAD",
      order: 3,

      roleAccess: ["ADMIN", "USER"],
      licenseAccess: ["FREE", "PAID"],
      children: [
        {
          name: "Ixigua",
          code: "IXIGUA",
          screenPath: "/download/ixigua",
          roleAccess: ["ADMIN", "USER"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "Haokan",
          order: 1,
          code: "HAOKAN",
          screenPath: "/download/haokan",
          roleAccess: ["ADMIN", "USER"],
          licenseAccess: ["FREE", "PAID"],
        },
      ],
    },
    {
      name: "Cài đặt",
      order: 4,
      code: "SETTINGS",
      roleAccess: ["ADMIN", "USER"],
      licenseAccess: ["FREE", "PAID"],
      children: [
        {
          name: "Cài đặt chung",
          code: "GENERAL",
          screenPath: "/settings/general",
          roleAccess: ["ADMIN", "USER"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "Tài khoản",
          code: "ACCOUNT",
          screenPath: "/settings/account",
          roleAccess: ["ADMIN", "USER"],
          licenseAccess: ["FREE", "PAID"],
        },
      ],
    },
  ],
};
