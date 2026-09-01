/* @ds-bundle: {"format":4,"namespace":"GivenLoyisoDesignSystem_83f551","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"ProjectCard","sourcePath":"components/core/ProjectCard.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"SocialLink","sourcePath":"components/core/SocialLink.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"1366586551c9","components/core/Button.jsx":"9eaeefd01077","components/core/Card.jsx":"dbfd8fb6cda8","components/core/Eyebrow.jsx":"f0c7fcd092de","components/core/Input.jsx":"da9901faebec","components/core/ProjectCard.jsx":"b180752000d7","components/core/SectionHeading.jsx":"5ddff8f51b50","components/core/SocialLink.jsx":"f28829dd24f4","components/core/Stat.jsx":"3e4845ddd497","components/core/Tag.jsx":"58e26a079b33","ui_kits/portfolio/app.jsx":"820b0657691b","ui_kits/portfolio/icons.jsx":"e23d01b1b589","ui_kits/portfolio/sections.jsx":"3483225edbed"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GivenLoyisoDesignSystem_83f551 = window.GivenLoyisoDesignSystem_83f551 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Status/availability badge — solid dot + label.
 */
function Badge({
  children,
  tone = 'success',
  pulse = false,
  ...rest
}) {
  const tones = {
    success: 'var(--success)',
    gold: 'var(--gold-500)',
    freq: 'var(--freq-violet)',
    neutral: 'var(--silver-400)'
  };
  const c = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.06em',
      color: 'var(--silver-200)',
      padding: '6px 12px 6px 10px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-raised)',
      boxShadow: 'inset 0 0 0 1px var(--border)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: c,
      boxShadow: `0 0 10px ${c}`,
      animation: pulse ? 'gl-pulse 1.8s var(--ease-in-out) infinite' : 'none'
    }
  }), children, /*#__PURE__*/React.createElement("style", null, '@keyframes gl-pulse{0%,100%{opacity:1}50%{opacity:.35}}'));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizes = {
  sm: {
    padding: '8px 16px',
    fontSize: 13
  },
  md: {
    padding: '12px 22px',
    fontSize: 15
  },
  lg: {
    padding: '16px 30px',
    fontSize: 17
  }
};
const base = {
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  letterSpacing: '0.01em',
  border: 'none',
  cursor: 'pointer',
  borderRadius: 'var(--radius-pill)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  lineHeight: 1,
  transition: 'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
  textDecoration: 'none',
  whiteSpace: 'nowrap'
};
const variants = {
  primary: {
    background: 'var(--grad-gold)',
    color: 'var(--text-on-gold)',
    boxShadow: 'var(--glow-gold)'
  },
  secondary: {
    background: 'transparent',
    color: 'var(--silver-100)',
    boxShadow: 'inset 0 0 0 1px var(--border-strong)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    boxShadow: 'none'
  },
  freq: {
    background: 'var(--freq-violet)',
    color: '#fff',
    boxShadow: 'var(--glow-freq)'
  }
};

/**
 * Given Loyiso primary call-to-action button.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconRight = null,
  iconLeft = null,
  as = 'button',
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const Tag = as;
  const hoverStyle = !disabled && hover ? {
    primary: {
      filter: 'brightness(1.06)'
    },
    secondary: {
      color: 'var(--gold-500)',
      boxShadow: 'inset 0 0 0 1px var(--border-gold)'
    },
    ghost: {
      color: 'var(--gold-500)'
    },
    freq: {
      filter: 'brightness(1.1)'
    }
  }[variant] : {};
  return /*#__PURE__*/React.createElement(Tag, _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    disabled: as === 'button' ? disabled : undefined,
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...hoverStyle,
      transform: press ? 'scale(0.985)' : hover && !disabled ? 'translateY(-1px)' : 'none',
      opacity: disabled ? 0.45 : 1,
      pointerEvents: disabled ? 'none' : 'auto'
    }
  }), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Base surface card. `featured` upgrades to gold hairline + glow.
 */
function Card({
  children,
  featured = false,
  interactive = false,
  padding = 24,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      padding,
      boxShadow: featured ? 'var(--glow-gold), var(--shadow-lg)' : hover ? 'inset 0 0 0 1px var(--border-gold), var(--shadow-lg)' : 'var(--ring-hair), var(--shadow-md)',
      transform: hover ? 'translateY(-3px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...(rest.style || {})
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Uppercase mono eyebrow label with wide tracking — the section kicker.
 */
function Eyebrow({
  children,
  color = 'gold',
  glyph = '✦',
  ...rest
}) {
  const c = color === 'gold' ? 'var(--gold-500)' : color === 'silver' ? 'var(--silver-400)' : color === 'freq' ? 'var(--freq-violet)' : color;
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: c,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }), glyph ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      opacity: 0.9
    }
  }, glyph) : null, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Dark text input / textarea with gold focus ring.
 */
function Input({
  label,
  as = 'input',
  hint,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const Field = as;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: focus ? 'var(--gold-500)' : 'var(--text-muted)',
      transition: 'color var(--dur-base) var(--ease-out)'
    }
  }, label) : null, /*#__PURE__*/React.createElement(Field, _extends({}, rest, {
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--text)',
      background: 'var(--surface-input)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      padding: as === 'textarea' ? '14px 16px' : '13px 16px',
      boxShadow: focus ? 'inset 0 0 0 1px var(--border-gold), 0 0 0 3px rgba(201,162,75,0.12)' : 'inset 0 0 0 1px var(--border)',
      outline: 'none',
      resize: as === 'textarea' ? 'vertical' : undefined,
      minHeight: as === 'textarea' ? 110 : undefined,
      transition: 'box-shadow var(--dur-base) var(--ease-out)',
      width: '100%',
      boxSizing: 'border-box',
      ...(rest.style || {})
    }
  })), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-faint)'
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Section heading: eyebrow + display-serif title + optional lede.
 */
function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      textAlign: align,
      alignItems: align === 'center' ? 'center' : 'flex-start',
      maxWidth: 640
    }
  }), eyebrow ? /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, eyebrow) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'clamp(30px, 4vw, 48px)',
      lineHeight: 1.08,
      letterSpacing: '-0.02em',
      color: 'var(--text)',
      margin: 0
    }
  }, title), lede ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, lede) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/SocialLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon-first social link chip (Instagram, GitHub, etc.). Uses Lucide via
 * currentColor; pass the SVG node as `icon`.
 */
function SocialLink({
  icon,
  label,
  handle,
  href = '#',
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href
  }, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      textDecoration: 'none',
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface)',
      boxShadow: hover ? 'inset 0 0 0 1px var(--border-gold)' : 'inset 0 0 0 1px var(--border)',
      transition: 'box-shadow var(--dur-base) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
      transform: hover ? 'translateY(-2px)' : 'none',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: hover ? 'var(--gold-500)' : 'var(--silver-300)',
      display: 'inline-flex',
      transition: 'color var(--dur-base) var(--ease-out)'
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.2
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 500,
      color: 'var(--text)'
    }
  }, handle)));
}
Object.assign(__ds_scope, { SocialLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SocialLink.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
/**
 * A single big-number statistic with a serif gold numeral + mono label.
 */
function Stat({
  value,
  label,
  accent = 'gold'
}) {
  const grad = accent === 'silver' ? 'var(--grad-silver)' : 'var(--grad-gold)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'clamp(38px, 5vw, 56px)',
      lineHeight: 1,
      background: grad,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      letterSpacing: '-0.02em'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Small pill tag for skills / tech / categories.
 */
function Tag({
  children,
  tone = 'neutral',
  ...rest
}) {
  const tones = {
    neutral: {
      color: 'var(--silver-300)',
      boxShadow: 'inset 0 0 0 1px var(--border)'
    },
    gold: {
      color: 'var(--gold-400)',
      boxShadow: 'inset 0 0 0 1px var(--border-gold)'
    },
    freq: {
      color: 'var(--freq-cyan)',
      boxShadow: 'inset 0 0 0 1px rgba(53,229,208,0.35)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.02em',
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)',
      background: 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      ...tones[tone]
    }
  }), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/ProjectCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Project / work card for the portfolio grid.
 */
function ProjectCard({
  title,
  blurb,
  tags = [],
  year,
  index,
  featured = false,
  imageSrc,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({}, rest, {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'block',
      textDecoration: 'none',
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: featured || hover ? 'inset 0 0 0 1px var(--border-gold), var(--shadow-lg)' : 'var(--ring-hair), var(--shadow-md)',
      transform: hover ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
      ...(rest.style || {})
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 168,
      background: imageSrc ? `center/cover no-repeat url(${imageSrc})` : 'radial-gradient(80% 120% at 20% 0%, rgba(201,162,75,0.20), transparent 60%), var(--ink-600)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: hover ? 'linear-gradient(180deg, transparent, rgba(201,162,75,0.10))' : 'transparent',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }), typeof index === 'number' && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      left: 16,
      fontFamily: 'var(--font-display)',
      fontSize: 30,
      fontWeight: 600,
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, String(index).padStart(2, '0'))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      fontWeight: 600,
      color: 'var(--text)',
      margin: 0,
      letterSpacing: '-0.01em'
    }
  }, title), year ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, year) : null), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      lineHeight: 1.6,
      color: 'var(--text-muted)',
      margin: '10px 0 16px'
    }
  }, blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, tags.map(t => /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    key: t
  }, t)))));
}
Object.assign(__ds_scope, { ProjectCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProjectCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/app.jsx
try { (() => {
/* Given Loyiso portfolio — app shell + project detail overlay. */
const NS2 = window.GivenLoyisoDesignSystem_83f551;
function ProjectOverlay({
  project,
  onClose
}) {
  if (!project) return null;
  const {
    Tag,
    Button
  } = NS2;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(8,8,11,0.7)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      animation: 'gl-fade .24s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 'min(680px, 100%)',
      background: 'var(--surface)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--glow-gold), var(--shadow-xl)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 200,
      background: 'radial-gradient(80% 120% at 20% 0%, rgba(201,162,75,0.22), transparent 60%), var(--ink-600)',
      display: 'flex',
      alignItems: 'flex-end',
      padding: 26
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 52,
      fontWeight: 600,
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, project.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 30
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, project.tags.map(t => /*#__PURE__*/React.createElement(Tag, {
    key: t
  }, t))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, project.year)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 17,
      lineHeight: 1.7,
      color: 'var(--text-secondary)',
      marginTop: 20
    }
  }, project.blurb), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: 1.7,
      color: 'var(--text-muted)',
      marginTop: 12
    }
  }, "A deeper case study would live here \u2014 the problem, the approach, and what shipped. Replace this with real project detail."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement(Button, {
    iconRight: /*#__PURE__*/React.createElement(window.IconArrow, {
      size: 16
    })
  }, "Visit project"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Close")))));
}
function App() {
  const [project, setProject] = React.useState(null);
  const scrollTo = id => {
    if (id === 'top') return document.getElementById('gl-scroll')?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.Nav, {
    onNav: scrollTo
  }), /*#__PURE__*/React.createElement(window.Hero, null), /*#__PURE__*/React.createElement(window.Manifesto, null), /*#__PURE__*/React.createElement(window.Work, {
    onOpen: setProject
  }), /*#__PURE__*/React.createElement(window.About, null), /*#__PURE__*/React.createElement(window.Connect, null), /*#__PURE__*/React.createElement(window.Footer, null), /*#__PURE__*/React.createElement(ProjectOverlay, {
    project: project,
    onClose: () => setProject(null)
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/icons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide icons (MIT) — copied stroke paths, rendered with currentColor.
   Stroke 1.75, rounded joins — matches the brand iconography rule. */
const Ico = ({
  children,
  size = 20,
  ...p
}) => /*#__PURE__*/React.createElement("svg", _extends({
  xmlns: "http://www.w3.org/2000/svg",
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, p), children);
const IconInstagram = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("rect", {
  width: "20",
  height: "20",
  x: "2",
  y: "2",
  rx: "5",
  ry: "5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
}), /*#__PURE__*/React.createElement("line", {
  x1: "17.5",
  x2: "17.51",
  y1: "6.5",
  y2: "6.5"
}));
const IconGithub = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
  d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 4 5 4 5 4c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 11c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M9 18c-4.51 2-5-2-7-2"
}));
const IconX = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
  d: "M4 4l11.733 16h4.267l-11.733 -16z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"
}));
const IconMail = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("rect", {
  width: "20",
  height: "16",
  x: "2",
  y: "4",
  rx: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
}));
const IconArrow = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
  d: "M7 7h10v10"
}), /*#__PURE__*/React.createElement("path", {
  d: "M7 17 17 7"
}));
const IconArrowRight = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
  d: "M5 12h14"
}), /*#__PURE__*/React.createElement("path", {
  d: "m12 5 7 7-7 7"
}));
const IconSpark = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 3v18"
}), /*#__PURE__*/React.createElement("path", {
  d: "M3 12h18"
}), /*#__PURE__*/React.createElement("path", {
  d: "M5.6 5.6l12.8 12.8"
}), /*#__PURE__*/React.createElement("path", {
  d: "M18.4 5.6 5.6 18.4"
}));
const IconCode = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
  d: "m16 18 6-6-6-6"
}), /*#__PURE__*/React.createElement("path", {
  d: "m8 6-6 6 6 6"
}));
const IconMoon = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
}));
const IconLinkedin = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
  d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
}), /*#__PURE__*/React.createElement("rect", {
  width: "4",
  height: "12",
  x: "2",
  y: "9"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "4",
  cy: "4",
  r: "2"
}));
const IconPin = p => /*#__PURE__*/React.createElement(Ico, p, /*#__PURE__*/React.createElement("path", {
  d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "10",
  r: "3"
}));
Object.assign(window, {
  IconInstagram,
  IconGithub,
  IconX,
  IconMail,
  IconArrow,
  IconArrowRight,
  IconSpark,
  IconCode,
  IconMoon,
  IconLinkedin,
  IconPin
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portfolio/sections.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Given Loyiso — portfolio sections. Composes the DS bundle primitives.
   Real content from CV; palette anchored on gold + obsidian (accents kept quiet). */
const NS = window.GivenLoyisoDesignSystem_83f551;
const {
  Button,
  Tag,
  Badge,
  Eyebrow,
  Stat,
  Input,
  ProjectCard,
  SectionHeading,
  SocialLink
} = NS;
const wrap = {
  maxWidth: 1120,
  margin: '0 auto',
  padding: '0 32px'
};
const LOGO = '../../assets/logo-signature.png';

/* ---------------- Nav ---------------- */
function Nav({
  onNav
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById('gl-scroll');
    const fn = () => setScrolled((el ? el.scrollTop : window.scrollY) > 20);
    (el || window).addEventListener('scroll', fn);
    return () => (el || window).removeEventListener('scroll', fn);
  }, []);
  const link = (id, label) => /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav(id),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'color .2s'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--gold-500)',
    onMouseLeave: e => e.currentTarget.style.color = 'var(--text-secondary)'
  }, label);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: scrolled ? 'rgba(8,8,11,0.72)' : 'transparent',
      backdropFilter: scrolled ? 'var(--blur-glass)' : 'none',
      WebkitBackdropFilter: scrolled ? 'var(--blur-glass)' : 'none',
      boxShadow: scrolled ? '0 1px 0 var(--border)' : 'none',
      transition: 'background .3s, box-shadow .3s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      height: 74,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav('top'),
    style: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO,
    alt: "Given Loyiso",
    style: {
      height: 42,
      width: 'auto',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, link('work', 'Work'), link('about', 'About'), link('connect', 'Connect'), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onNav('connect')
  }, "Hire me"))));
}

/* ---------------- Animated gold-mote backdrop ---------------- */
function HeroBackdrop() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w,
      h,
      dpr,
      raf,
      t = 0;
    const motes = [];
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const N = Math.round(Math.min(70, w * h / 16000));
    for (let i = 0; i < N; i++) {
      motes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.2,
        vx: -0.15 + Math.random() * 0.3,
        vy: -0.25 - Math.random() * 0.35,
        a: 0.15 + Math.random() * 0.5,
        tw: Math.random() * Math.PI * 2
      });
    }
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      // soft drifting glow
      const gx = w * (0.5 + 0.12 * Math.sin(t * 0.004));
      const gy = h * (0.1 + 0.06 * Math.cos(t * 0.005));
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.55);
      g.addColorStop(0, 'rgba(201,162,75,0.16)');
      g.addColorStop(0.5, 'rgba(201,162,75,0.05)');
      g.addColorStop(1, 'rgba(201,162,75,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      // gold motes
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        m.tw += 0.02;
        if (m.y < -10) {
          m.y = h + 10;
          m.x = Math.random() * w;
        }
        if (m.x < -10) m.x = w + 10;
        if (m.x > w + 10) m.x = -10;
        const tw = 0.55 + 0.45 * Math.sin(m.tw);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226,197,124,${m.a * tw})`;
        ctx.shadowColor = 'rgba(201,162,75,0.9)';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none'
    }
  });
}

/* ---------------- Hero ---------------- */
function Hero() {
  const goldHalo = 'radial-gradient(56% 60% at 50% -6%, rgba(201,162,75,0.18), transparent 68%)';
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: goldHalo,
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement(HeroBackdrop, null), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      position: 'relative',
      padding: '84px 32px 96px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block',
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    pulse: true
  }, "Open to build \xB7 invest \xB7 collaborate \u2014 Amsterdam")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Creator \xB7 Founder \xB7 Technologist")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      fontSize: 'clamp(46px, 8vw, 92px)',
      lineHeight: 1.02,
      margin: 0,
      color: 'var(--text)'
    }
  }, "I build with", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "intention")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 19,
      lineHeight: 1.6,
      color: 'var(--text-secondary)',
      maxWidth: 620,
      margin: '26px auto 0'
    }
  }, "Creator, founder and technologist. Whatever you're building \u2014 a product, a company, a space, an idea \u2014 the rare part isn't the work. It's who you build it with."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      justifyContent: 'center',
      marginTop: 36,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.IconArrowRight, {
      size: 18
    }),
    onClick: () => document.getElementById('connect')?.scrollIntoView()
  }, "Let's build"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => document.getElementById('work')?.scrollIntoView()
  }, "View work")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 54,
      justifyContent: 'center',
      marginTop: 62,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    value: "9+",
    label: "Years shipping"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "20+",
    label: "Products delivered",
    accent: "silver"
  }), /*#__PURE__*/React.createElement(Stat, {
    value: "1",
    label: "SaaS founded"
  }))));
}

/* ---------------- Manifesto band ---------------- */
function Manifesto() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/given-working.jpg",
    alt: "",
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 30%',
      opacity: 0.32,
      filter: 'grayscale(0.2) contrast(1.02)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, var(--ink-900) 0%, rgba(8,8,11,0.72) 42%, rgba(8,8,11,0.86) 100%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(50% 120% at 50% 50%, rgba(201,162,75,0.14), transparent 70%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      position: 'relative',
      padding: '120px 32px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 1,
      background: 'var(--grad-gold)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontWeight: 500,
      fontSize: 'clamp(30px, 4.6vw, 56px)',
      lineHeight: 1.16,
      letterSpacing: '-0.01em',
      color: 'var(--text)',
      margin: 0,
      maxWidth: 860
    }
  }, "I don't fit one box. Hire me for the product, the venture, the space \u2014 whatever you're building. The difference is ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      background: 'var(--grad-gold)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "working with me"), "."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, "\u2014 Given Loyiso")));
}

/* ---------------- Work ---------------- */
const PROJECTS = [{
  title: 'Meltizo',
  year: '2023–Now',
  blurb: 'Healthcare SaaS platform I founded and build end-to-end — product, mobile app, and cloud infrastructure.',
  tags: ['React Native', 'NestJS', 'PostgreSQL', 'AWS']
}, {
  title: 'GivenBase',
  year: '2016–Now',
  blurb: 'My freelance practice: custom platforms, internal tools and client applications across the full stack.',
  tags: ['React', 'Node.js', 'AWS']
}, {
  title: 'BFNL Redesign',
  year: '2024',
  blurb: 'Rebuilt Bedrijfsfitness Nederland’s corporate site and app — improving structure, accessibility, UX & SEO.',
  tags: ['HubSpot', 'React', 'NestJS']
}, {
  title: 'Enterprise Apps · iO',
  year: '2022–23',
  blurb: 'React Native interfaces and business logic for banking and public-sector platforms in agile international teams.',
  tags: ['React Native', 'TypeScript', 'Agile']
}];
function Work({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "work",
    style: {
      ...wrap,
      padding: '80px 32px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Selected Work",
    title: "Things I've built \u2014 and companies I've started",
    lede: "Products, ventures and client work. Some I founded, some I engineered, all built with intention."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 24,
      marginTop: 44
    }
  }, PROJECTS.map((p, i) => /*#__PURE__*/React.createElement(ProjectCard, _extends({
    key: p.title,
    index: i + 1
  }, p, {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onOpen(p);
    }
  })))));
}

/* ---------------- About ---------------- */
function About() {
  const skills = ['React Native', 'React / Next.js', 'TypeScript', 'Node.js', 'NestJS', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'];
  return /*#__PURE__*/React.createElement("section", {
    id: "about",
    style: {
      background: 'var(--ink-800)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '80px 32px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "About"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 40,
      lineHeight: 1.12,
      margin: '14px 0 0',
      color: 'var(--text)'
    }
  }, "More than a developer \u2014 a builder of things that matter"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-secondary)',
      marginTop: 18
    }
  }, "I'm Given Loyiso, based in Amsterdam. I'm a creator, an entrepreneur, and yes \u2014 a serious engineer. I founded ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--gold-400)',
      fontWeight: 600
    }
  }, "Meltizo"), ", a healthcare SaaS, and I've shipped products for banks, agencies and startups for 9+ years. But I don't see myself as one label. I'm a pioneer in whatever I'm called to build."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-muted)',
      marginTop: 14
    }
  }, "The engineering is real and deep \u2014 it's how I turn vision into something you can hold. If you're a founder, investor or creator building something meaningful, let's talk."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--text-faint)',
      marginTop: 26,
      marginBottom: 10
    }
  }, "The craft underneath"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, skills.map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: '4/5',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--glow-gold), var(--shadow-lg)',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/given-portrait.jpg",
    alt: "Given Loyiso",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, transparent 55%, rgba(8,8,11,0.5))'
    }
  }))));
}

/* ---------------- Connect ---------------- */
function Connect() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    id: "connect",
    style: {
      ...wrap,
      padding: '84px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Let's Talk"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 44,
      lineHeight: 1.08,
      margin: '14px 0 0',
      color: 'var(--text)'
    }
  }, "Let's build something that matters"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--text-secondary)',
      marginTop: 16,
      maxWidth: 380
    }
  }, "Tell me about your project. I take on a small number of collaborations at a time."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 30,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(SocialLink, {
    label: "Email",
    handle: "info@givenloyiso.com",
    href: "mailto:info@givenloyiso.com",
    icon: /*#__PURE__*/React.createElement(window.IconMail, null)
  }), /*#__PURE__*/React.createElement(SocialLink, {
    label: "LinkedIn",
    handle: "in/givenloyiso",
    href: "https://linkedin.com/in/givenloyiso",
    icon: /*#__PURE__*/React.createElement(window.IconLinkedin, null)
  }), /*#__PURE__*/React.createElement(SocialLink, {
    label: "Instagram",
    handle: "@givenloyiso",
    href: "https://instagram.com/givenloyiso",
    icon: /*#__PURE__*/React.createElement(window.IconInstagram, null)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface)',
      borderRadius: 'var(--radius-lg)',
      padding: 30,
      boxShadow: 'var(--ring-hair), var(--shadow-md)',
      alignSelf: 'start'
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '40px 10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--gold-500)',
      fontSize: 30
    }
  }, "\u2726"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 26,
      color: 'var(--text)',
      margin: '10px 0 6px'
    }
  }, "Message received"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      color: 'var(--text-muted)'
    }
  }, "I'll be in touch soon. Thank you.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Name",
    placeholder: "Your name",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "you@studio.com",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "What are we building?",
    as: "textarea",
    placeholder: "A few words about the project\u2026",
    required: true
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(window.IconArrowRight, {
      size: 18
    })
  }, "Send message")))));
}

/* ---------------- Footer ---------------- */
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border)',
      background: 'var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      padding: '32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: LOGO,
    alt: "Given Loyiso",
    style: {
      height: 40,
      width: 'auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-faint)'
    }
  }, "\xA9 2026 \xB7 Amsterdam \xB7 Built with intention"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      color: 'var(--silver-400)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://linkedin.com/in/givenloyiso",
    style: {
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(window.IconLinkedin, {
    size: 18
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://instagram.com/givenloyiso",
    style: {
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(window.IconInstagram, {
    size: 18
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement(window.IconGithub, {
    size: 18
  })))));
}
Object.assign(window, {
  Nav,
  Hero,
  Manifesto,
  Work,
  About,
  Connect,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portfolio/sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ProjectCard = __ds_scope.ProjectCard;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.SocialLink = __ds_scope.SocialLink;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tag = __ds_scope.Tag;

})();
