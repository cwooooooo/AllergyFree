---
name: AllergyFree Design System
colors:
  surface: '#f3fcf1'
  surface-dim: '#d4dcd2'
  surface-bright: '#f3fcf1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef6eb'
  surface-container: '#e8f0e5'
  surface-container-high: '#e2ebe0'
  surface-container-highest: '#dce5da'
  on-surface: '#161d17'
  on-surface-variant: '#3d4a3e'
  inverse-surface: '#2b322b'
  inverse-on-surface: '#ebf3e8'
  outline: '#6c7b6d'
  outline-variant: '#bbcbbb'
  surface-tint: '#006d37'
  primary: '#006d37'
  on-primary: '#ffffff'
  primary-container: '#2ecc71'
  on-primary-container: '#005027'
  inverse-primary: '#4ae183'
  secondary: '#006b58'
  on-secondary: '#ffffff'
  secondary-container: '#6cf7d4'
  on-secondary-container: '#00705c'
  tertiary: '#98472a'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff9875'
  on-tertiary-container: '#772e14'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6bfe9c'
  primary-fixed-dim: '#4ae183'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005228'
  secondary-fixed: '#6ff9d6'
  secondary-fixed-dim: '#4eddbb'
  on-secondary-fixed: '#002019'
  on-secondary-fixed-variant: '#005141'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#793015'
  background: '#f3fcf1'
  on-background: '#161d17'
  surface-variant: '#dce5da'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1200px
  gutter: 16px
  margin-mobile: 20px
---

## Brand & Style

The design system is centered on the core values of **Safety, Clarity, and Compassion**. As a service dedicated to food safety and allergy management, the visual direction must strike a balance between medical-grade reliability and the warmth of a daily lifestyle companion.

The chosen style is **Modern Corporate with a Soft Humanist touch**. It avoids the sterility of purely clinical interfaces by utilizing generous whitespace, rounded geometric shapes, and a high-contrast color palette that prioritizes immediate legibility. The interface should feel "breathable"—giving users the mental space to make critical health decisions without feeling overwhelmed. 

The primary emotional response is one of **Reassurance**. Every interaction confirms that the service is vigilant, professional, and easy to navigate, ensuring that "safe food" is synonymous with "simple shopping."

## Colors

The color palette is built on a foundation of "Health Greens" to evoke freshness and safety. 

- **Primary & Secondary:** Mint (#1ABC9C) and Green (#2ECC71) are used for brand identification and primary actions. These are balanced to ensure they feel energetic but grounded.
- **Status Colors (Critical):** This design system employs a rigorous traffic-light system for food safety. 
    - **Safe (섭취 가능):** A vibrant, deep green to signal absolute clearance.
    - **Caution (주의 필요):** A warm amber that stands out against white backgrounds without being as alarming as red.
    - **Danger (섭취 불가):** A clear, high-saturation red used sparingly but decisively for allergens.
- **Neutrals:** Use a cool-toned slate (#2C3E50) for typography to maintain high contrast, while off-white surfaces (#F8FAFB) reduce eye strain compared to pure white.

## Typography

This design system utilizes a dual-font approach to balance personality with utility. **Plus Jakarta Sans** is used for headlines to provide a friendly, modern, and slightly rounded geometric feel. **Inter** is used for all body text and UI labels to ensure maximum legibility and a systematic, professional tone, especially when displaying complex ingredient lists.

For Korean implementation, **Pretendard** should be used as the primary typeface across all roles to maintain consistent weight distribution and superior rendering of Hangul characters.

- **Hierarchy:** Maintain a strict vertical rhythm. Headlines should be noticeably heavier (SemiBold/Bold) to allow users to scan safety information rapidly.
- **Accessibility:** Body text never drops below 14px to accommodate users checking labels in varying lighting conditions (e.g., grocery stores).

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** system with a focus on mobile-first utility. Given that users will likely use this service while shopping, the spacing is generous to prevent accidental taps.

- **The 8pt Grid:** All components and layouts follow an 8px (or 4px for fine-tuning) incremental scale.
- **Mobile:** A single-column layout with 20px side margins ensures content is centered and readable on the go.
- **Desktop/Tablet:** A 12-column grid with a 24px gutter. Content cards (like food items) should reflow from 2 columns on mobile to 4 or 6 columns on desktop.
- **Information Density:** Use "L" spacing (24px) to separate distinct sections (e.g., Product Info vs. Ingredient Analysis) and "S" spacing (8px) for internal element grouping.

## Elevation & Depth

To maintain a clean and professional aesthetic, this design system uses **Tonal Layers** supplemented by **Ambient Shadows**.

- **Surfaces:** The primary background is the neutral surface color. Cards and containers use pure white to pop forward.
- **Shadows:** Use extremely soft, low-opacity shadows (e.g., 4% - 8% alpha) with a large blur radius. This creates a sense of "lift" rather than a hard edge, reinforcing the friendly brand personality.
- **Safe State Elevation:** Elements designated as "Safe" may use a subtle green-tinted shadow to provide a subconscious positive reinforcement.
- **Functional Depth:** Interactive elements like buttons use a slight drop shadow, while static informational cards use a 1px soft border (#E2E8F0) to maintain a flat, organized look.

## Shapes

The shape language is **Rounded**, signifying approachability and kindness. 

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) corner radius.
- **Large Containers:** Product detail cards and modals use the `rounded-lg` (16px) or `rounded-xl` (24px) scale to soften the overall appearance of the UI.
- **Status Tags:** Tags indicating "Safe" or "Danger" should use a fully pill-shaped (rounded-full) radius to distinguish them from functional buttons.

## Components

Components are designed for high-stress environments where clarity is paramount.

- **Buttons:** Primary buttons use a solid Mint/Green fill with white text. They feature a generous height (48px-56px) for easy mobile tapping. Secondary buttons use a ghost style with a 2px border.
- **Safety Chips (Status Indicators):** These are the most critical components. They must include both a color fill and a clear icon (e.g., a checkmark for Safe, an exclamation for Caution, an 'X' for Danger) to ensure accessibility for color-blind users.
- **Food Detail Cards:** These should feature a large product image, a clear title, and a prominent "Status Chip" at the top right.
- **Ingredient Lists:** Use high-contrast text. Any detected allergens must be highlighted with a soft red background tint and bolded text for immediate recognition.
- **Search & Filter:** Input fields should have clear "Focus" states using the primary Mint color. Filters for specific allergies (Milk, Peanut, etc.) should use toggle-style chips that change to the primary green when active.
- **Iconography:** Use thick, rounded line icons (2px stroke) to match the typography's weight and the overall roundedness of the system.