module.exports = {
  screensDefault: [
    {
      name: "Administrator",
      code: "ADMINISTRATOR",
      roleAccess: ["ADMIN"],
      licenseAccess: ["FREE", "PAID"],
      prefixPath: "/admin",
      order: 1,
      children: [
        {
          name: "Role",
          code: "ROLE",
          screenPath: "/role",
          roleAccess: ["ADMIN"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "Function",
          code: "FUNCTION",
          screenPath: "/function",
          roleAccess: ["ADMIN"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "License",
          code: "LICENSE",
          screenPath: "/license",
          roleAccess: ["ADMIN"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "Screen",
          code: "SCREEN",
          screenPath: "/screen",
          roleAccess: ["ADMIN"],
          licenseAccess: ["FREE", "PAID"],
        },
      ],
    },
    {
      name: "Tổng quan",
      order: 2,

      code: "HOME",
      screenPath: "/home",
      roleAccess: ["ADMIN", "USER"],
      licenseAccess: ["FREE", "PAID"],
    },
    {
      name: "Video",
      order: 3,

      code: "VIDEO",
      prefixPath: "/video",
      roleAccess: ["ADMIN", "USER"],
      licenseAccess: ["FREE", "PAID"],
      children: [
        {
          name: "Sub Video",
          code: "SUB_VIDEO",
          screenPath: "/sub-video",
          roleAccess: ["ADMIN", "USER"],
          licenseAccess: ["FREE", "PAID"],
        },
      ],
    },
    {
      name: "Download",
      code: "DOWNLOAD",
      order: 3,
      prefixPath: "/download",
      roleAccess: ["ADMIN", "USER"],
      licenseAccess: ["FREE", "PAID"],
      children: [
        {
          name: "Ixigua",
          code: "IXIGUA",
          screenPath: "/ixigua",
          roleAccess: ["ADMIN", "USER"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "Haokan",
          order: 1,
          code: "HAOKAN",
          screenPath: "/haokan",
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
      prefixPath: "/settings",
      licenseAccess: ["FREE", "PAID"],
      children: [
        {
          name: "Cài đặt chung",
          code: "GENERAL",
          screenPath: "/general",
          roleAccess: ["ADMIN", "USER"],
          licenseAccess: ["FREE", "PAID"],
        },
        {
          name: "Tài khoản",
          code: "ACCOUNT",
          screenPath: "/account",
          roleAccess: ["ADMIN", "USER"],
          licenseAccess: ["FREE", "PAID"],
        },
      ],
    },
  ],
};
