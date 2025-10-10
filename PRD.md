# Planning Guide

A community-driven platform where supporters can pledge to fold and mail origami paper cranes to Angela before her stem cell transplant on October 22, 2025, honoring the Japanese senbazuru tradition of folding 1000 cranes for healing and good fortune.

**Experience Qualities**:
1. **Hopeful** - The design should radiate optimism and positive energy, celebrating the healing tradition of senbazuru and the community coming together for Angela's recovery
2. **Gentle** - Soft, calming aesthetics inspired by origami paper and Japanese design principles, creating a welcoming space that doesn't overwhelm during an emotional time
3. **Communal** - Emphasizing collective effort through the live leaderboard and progress tracking, making each contribution feel like part of something bigger

**Complexity Level**: Light Application (multiple features with basic state)
  - This is more than a static information page but less than a complex application. It features a signup form, live leaderboard, progress tracking, and admin-only update capabilities, all centered around a single focused mission.

## Essential Features

### Crane Pledge Signup
- **Functionality**: Visitors can commit to folding and mailing a specific number of origami cranes
- **Purpose**: Captures community commitments and builds momentum toward the 1000-crane goal
- **Trigger**: User clicks "Make a Pledge" or similar prominent call-to-action button
- **Progression**: Click pledge button → Form appears with name and crane count inputs → User enters details → Submit → Confirmation message appears → Name added to leaderboard
- **Success criteria**: Form data persists in KV store, user sees confirmation, leaderboard updates immediately to show new pledge

### Live Leaderboard
- **Functionality**: Displays all supporters and their pledged crane counts in descending order
- **Purpose**: Creates excitement, shows community participation, and motivates others to contribute
- **Trigger**: Automatically visible on page load
- **Progression**: Page loads → Leaderboard fetches pledge data → Displays sorted by crane count → Updates in real-time as new pledges arrive
- **Success criteria**: Shows supporter names, crane counts, updates immediately upon new submissions, sorts correctly by quantity

### Progress Tracker
- **Functionality**: Shows visual progress toward the 1000-crane goal using pledged and received counts
- **Purpose**: Visualizes how close the community is to the goal, celebrates milestones
- **Trigger**: Automatically visible on page load
- **Progression**: Page loads → Fetches total pledged and total received → Displays progress bars/counters → Updates when admin updates received count or new pledges come in
- **Success criteria**: Accurate count display, visual progress representation (progress bar or circular indicator), celebration state when reaching 1000

### Admin Total Received Update
- **Functionality**: Secure API endpoint for updating the actual count of cranes received in the mail
- **Purpose**: Keeps the community informed of real progress as physical cranes arrive
- **Trigger**: Admin makes API call to update received count
- **Progression**: Admin calls API with authentication → System validates owner status → Updates total received in KV store → Count updates across all user displays in real-time
- **Success criteria**: Only accessible via authenticated API (using spark.user().isOwner), updates persist in KV store, immediately reflects in progress tracker for all users

### Mailing Information Display
- **Functionality**: Clear, accessible display of the mailing address and deadline
- **Purpose**: Makes it easy for pledgers to know where and when to send cranes
- **Trigger**: Always visible on the page
- **Progression**: Information displayed prominently → Users can easily copy address → Deadline clearly shown
- **Success criteria**: Address (3410 E Escuda Rd, Phoenix, AZ 85050) and date (October 22, 2025) are immediately visible and readable

## Edge Case Handling
- **Empty leaderboard** - Show encouraging message like "Be the first to pledge cranes for Angela!" with crane illustration
- **Goal exceeded** - Celebrate when pledges or received count passes 1000 with confetti animation or special message
- **Invalid pledge numbers** - Validate that crane counts are positive numbers, provide helpful error messages
- **Duplicate names** - Allow duplicate names but show them as separate entries (friends might have same first name)
- **Unauthorized API access** - Admin API endpoints validate user.isOwner status server-side before allowing updates

## Design Direction
The design should feel gentle, hopeful, and inspired by Japanese aesthetics—soft pastels reminiscent of origami paper, clean minimalist layouts with generous white space, and playful crane illustrations or subtle paper fold textures. The interface should feel light and uplifting rather than medical or clinical, celebrating the tradition and community effort. A minimal but warm interface serves the emotional core of the mission.

## Color Selection
Analogous (adjacent colors on color wheel) - Soft pinks, peaches, and warm corals inspired by traditional origami paper, creating a gentle, harmonious palette that feels optimistic and healing.

- **Primary Color**: Soft coral pink (oklch(0.75 0.12 25)) - Represents hope, warmth, and the vibrant spirit of paper cranes; used for primary actions and crane motifs
- **Secondary Colors**: 
  - Gentle peach (oklch(0.85 0.08 45)) - Supporting color for cards and secondary UI elements
  - Warm cream (oklch(0.95 0.02 60)) - Soft backgrounds that don't compete with content
- **Accent Color**: Bright origami red (oklch(0.65 0.20 25)) - Draws attention to CTAs, goal milestones, and celebration moments
- **Foreground/Background Pairings**:
  - Background (Warm cream oklch(0.98 0.01 60)): Charcoal text (oklch(0.25 0 0)) - Ratio 13.1:1 ✓
  - Card (Gentle peach oklch(0.92 0.04 45)): Dark gray text (oklch(0.30 0 0)) - Ratio 10.2:1 ✓
  - Primary (Soft coral oklch(0.70 0.12 25)): White text (oklch(1 0 0)) - Ratio 5.2:1 ✓
  - Accent (Bright red oklch(0.60 0.20 25)): White text (oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Muted (Pale pink oklch(0.88 0.03 30)): Medium gray text (oklch(0.45 0 0)) - Ratio 5.8:1 ✓

## Font Selection
Typefaces should balance playful approachability with elegant simplicity, honoring Japanese design's clean aesthetic while feeling warm and community-oriented. Noto Sans for body text (harmonizing with Japanese typography heritage) paired with a gentle rounded display font for headers.

- **Typographic Hierarchy**:
  - H1 (Site Title "Ang's Cranes"): Quicksand Bold / 48px / Normal letter spacing / Playful yet elegant
  - H2 (Section Headers): Quicksand SemiBold / 32px / Tight letter spacing
  - H3 (Subheadings): Noto Sans SemiBold / 20px / Normal spacing
  - Body Text: Noto Sans Regular / 16px / 1.6 line height / Comfortable reading
  - Stats/Numbers (crane counts): Quicksand Bold / 28px / Tabular numbers
  - Small Text (addresses, dates): Noto Sans Regular / 14px / 1.4 line height

## Animations
Animations should feel light and paper-like—gentle floating motions, soft folds, and delicate transitions that evoke origami cranes in flight, creating moments of delight without distracting from the mission's emotional weight.

- **Purposeful Meaning**: Floating crane illustrations that drift subtly across the background, page transitions that unfold like paper, success confirmations that flutter in like a crane landing
- **Hierarchy of Movement**: 
  - Primary: Progress bar fills with gentle ease-out, celebrating milestones
  - Secondary: Crane SVGs rotate slightly on hover, form inputs have soft focus animations
  - Tertiary: Leaderboard entries fade in sequentially, confetti when reaching 1000

## Component Selection
- **Components**: 
  - Card (leaderboard entries, pledge form container) - Soft shadows, rounded corners
  - Form (name input, crane count input) - with Label, Input components
  - Button (primary CTA for pledging) - Prominent coral color, slightly rounded
  - Progress (visual goal tracker) - Custom styled with crane motif
  - Badge (showing pledged vs received counts) - Gentle colors
  - Dialog (pledge form modal) - Centered, paper-like appearance
  - Alert (confirmation messages) - Soft, celebratory styling using sonner toasts
  
- **Customizations**: 
  - Custom crane SVG illustrations (origami-style geometric cranes)
  - Progress component styled with gradient fills and crane icon markers
  - Leaderboard with alternating subtle background colors for readability
  
- **States**: 
  - Buttons: Rest (coral), Hover (slightly darker, lift shadow), Active (pressed down), Disabled (muted peach)
  - Inputs: Default (soft border), Focus (coral ring), Error (gentle red), Success (soft green)
  - Form submission: Loading state shows origami crane animation
  
- **Icon Selection**: 
  - @phosphor-icons/react: Heart for community feel, CalendarCheck for deadline, MapPin for address, Crown for leaderboard top positions, Plus for adding pledges
  
- **Spacing**: 
  - Cards: p-6 (24px padding)
  - Sections: gap-8 (32px) for major sections, gap-4 (16px) for related elements
  - Container: max-w-4xl centered with px-4 mobile padding
  
- **Mobile**: 
  - Stack leaderboard and progress vertically on mobile
  - Form inputs become full-width below 640px
  - Font sizes scale down slightly (H1: 36px mobile)
  - Simplified crane illustrations on mobile to reduce visual complexity
  - Touch-friendly button sizing (min 44px height)
