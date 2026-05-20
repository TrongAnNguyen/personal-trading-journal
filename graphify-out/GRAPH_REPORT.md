# Graph Report - personal-trading-journal  (2026-05-20)

## Corpus Check
- 232 files · ~56,353 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1121 nodes · 3485 edges · 48 communities (41 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c90e196`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Account Management|Account Management]]
- [[_COMMUNITY_TipTap Blockquote Actions|TipTap Blockquote Actions]]
- [[_COMMUNITY_TipTap Editor Extensions|TipTap Editor Extensions]]
- [[_COMMUNITY_UI Button Components|UI Button Components]]
- [[_COMMUNITY_Trade List Views|Trade List Views]]
- [[_COMMUNITY_Account Pages and Skeletons|Account Pages and Skeletons]]
- [[_COMMUNITY_TipTap Toolbar Icons|TipTap Toolbar Icons]]
- [[_COMMUNITY_Trade Enums and Types|Trade Enums and Types]]
- [[_COMMUNITY_TipTap Link Components|TipTap Link Components]]
- [[_COMMUNITY_TipTap Text Alignment|TipTap Text Alignment]]
- [[_COMMUNITY_TipTap Action Buttons|TipTap Action Buttons]]
- [[_COMMUNITY_Trade Server Actions|Trade Server Actions]]
- [[_COMMUNITY_TipTap List Management|TipTap List Management]]
- [[_COMMUNITY_Knowledge Base Actions|Knowledge Base Actions]]
- [[_COMMUNITY_TipTap Color Highlight|TipTap Color Highlight]]
- [[_COMMUNITY_TipTap Undo Redo|TipTap Undo Redo]]
- [[_COMMUNITY_Tag Management Pages|Tag Management Pages]]
- [[_COMMUNITY_Account List Components|Account List Components]]
- [[_COMMUNITY_Tag Selector Component|Tag Selector Component]]
- [[_COMMUNITY_TipTap Heading Dropdown|TipTap Heading Dropdown]]
- [[_COMMUNITY_TipTap Image Upload|TipTap Image Upload]]
- [[_COMMUNITY_TipTap Color Utilities|TipTap Color Utilities]]
- [[_COMMUNITY_Authentication Routes|Authentication Routes]]
- [[_COMMUNITY_Dashboard Layout|Dashboard Layout]]
- [[_COMMUNITY_TipTap Heading Buttons|TipTap Heading Buttons]]
- [[_COMMUNITY_TipTap Color Popover|TipTap Color Popover]]
- [[_COMMUNITY_TipTap Editor Toolbar|TipTap Editor Toolbar]]
- [[_COMMUNITY_UI Sheet Component|UI Sheet Component]]
- [[_COMMUNITY_UI Tooltip Component|UI Tooltip Component]]
- [[_COMMUNITY_Theme Toggle Component|Theme Toggle Component]]
- [[_COMMUNITY_UI Popover Component|UI Popover Component]]
- [[_COMMUNITY_Note Page and Editor|Note Page and Editor]]
- [[_COMMUNITY_App Metadata and Fonts|App Metadata and Fonts]]
- [[_COMMUNITY_UI Avatar Component|UI Avatar Component]]
- [[_COMMUNITY_TipTap Image Button|TipTap Image Button]]
- [[_COMMUNITY_TipTap Text Align Button|TipTap Text Align Button]]
- [[_COMMUNITY_Knowledge Base Mentions|Knowledge Base Mentions]]
- [[_COMMUNITY_UI Tabs Component|UI Tabs Component]]
- [[_COMMUNITY_Trade Detail Pages|Trade Detail Pages]]
- [[_COMMUNITY_Middleware and Proxy|Middleware and Proxy]]

## God Nodes (most connected - your core abstractions)
1. `useTiptapEditor()` - 66 edges
2. `Button()` - 55 edges
3. `cn()` - 54 edges
4. `Card()` - 38 edges
5. `CardHeader()` - 36 edges
6. `CardContent()` - 36 edges
7. `parseShortcutKeys()` - 31 edges
8. `CardTitle()` - 30 edges
9. `isNodeTypeSelected()` - 29 edges
10. `Input()` - 26 edges

## Surprising Connections (you probably didn't know these)
- `getAuthenticatedUserId()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  src/lib/actions/utils.ts → lib/supabase/server.ts
- `proxy()` --calls--> `updateSession()`  [EXTRACTED]
  src/proxy.ts → lib/supabase/middleware.ts
- `signOut()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  src/app/auth/actions.ts → lib/supabase/server.ts
- `updatePassword()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  src/app/auth/actions.ts → lib/supabase/server.ts
- `POST()` --calls--> `createSupabaseServerClient()`  [EXTRACTED]
  src/app/api/upload/route.ts → lib/supabase/server.ts

## Communities (48 total, 7 thin omitted)

### Community 0 - "Account Management"
Cohesion: 0.07
Nodes (83): Account, AccountCardProps, CreateAccountInput, createAccountSchema, createAccount, Home(), EquityCurveChart(), EquityCurveChartProps (+75 more)

### Community 1 - "TipTap Blockquote Actions"
Cohesion: 0.06
Nodes (51): getAccounts, getDisciplineChecklist(), updateDisciplineChecklist(), createNote(), deleteNote(), getGraph, getNote, searchKB (+43 more)

### Community 2 - "TipTap Editor Extensions"
Cohesion: 0.05
Nodes (63): canColorHighlight(), getHighlightColorValue(), HIGHLIGHT_COLORS, HighlightColor, HighlightMode, isColorHighlightActive(), pickHighlightColorsByValue(), removeHighlight() (+55 more)

### Community 3 - "UI Button Components"
Cohesion: 0.05
Nodes (59): getNotes, NoteWithMeta, createTag, DashboardLayout(), DashboardLayoutProps, KnowledgeBaseLayout(), cn(), reviveDates() (+51 more)

### Community 4 - "Trade List Views"
Cohesion: 0.12
Nodes (33): deleteTrade, TradesPage(), formatPnL(), formatPrice(), TradeListRow(), TradeListRowProps, TradeListSkeleton(), TradeListTable() (+25 more)

### Community 5 - "Account Pages and Skeletons"
Cohesion: 0.09
Nodes (19): BlockquoteButton, BlockquoteButtonProps, BlockquoteShortcutBadge(), CodeBlockButton, CodeBlockButtonProps, CodeBlockShortcutBadge(), ColorHighlightButton, ColorHighlightButtonProps (+11 more)

### Community 6 - "TipTap Toolbar Icons"
Cohesion: 0.13
Nodes (23): getTrades, LiveTradesSkeleton(), MetricsSkeleton(), RecentActivitySkeleton(), LiveTrades(), MetricsGrid(), DashboardPage(), RecentActivity() (+15 more)

### Community 7 - "Trade Enums and Types"
Cohesion: 0.08
Nodes (26): Button, ButtonGroup, ButtonProps, ButtonSize, ButtonVariant, ShortcutDisplay(), Card, CardBody (+18 more)

### Community 8 - "TipTap Link Components"
Cohesion: 0.1
Nodes (24): canToggleMark(), getFormattedMarkName(), isMarkActive(), Mark, MARK_SHORTCUT_KEYS, markIcons, shouldShowButton(), toggleMark() (+16 more)

### Community 9 - "TipTap Text Alignment"
Cohesion: 0.11
Nodes (22): LinkButton, LinkContent(), LinkMain(), LinkMainProps, LinkPopover, LinkPopoverProps, canSetLink(), isLinkActive() (+14 more)

### Community 10 - "TipTap Action Buttons"
Cohesion: 0.14
Nodes (29): AssetClass, AttachmentContext, Emotion, TagType, TradeSide, TradeStatus, Account, Attachment (+21 more)

### Community 11 - "Trade Server Actions"
Cohesion: 0.12
Nodes (20): canToggle(), HEADING_SHORTCUT_KEYS, headingIcons, isHeadingActive(), Level, shouldShowButton(), useHeading(), UseHeadingConfig (+12 more)

### Community 12 - "TipTap List Management"
Cohesion: 0.14
Nodes (24): canToggleList(), isListActive(), LIST_SHORTCUT_KEYS, listIcons, listLabels, ListType, shouldShowButton(), useList() (+16 more)

### Community 13 - "Knowledge Base Actions"
Cohesion: 0.12
Nodes (12): HeadingDropdownMenu, HeadingDropdownMenuProps, getActiveHeadingLevel(), useHeadingDropdownMenu(), UseHeadingDropdownMenuConfig, useTiptapEditor(), ListDropdownMenu(), ListDropdownMenuProps (+4 more)

### Community 14 - "TipTap Color Highlight"
Cohesion: 0.21
Nodes (22): canToggleBlockquote(), shouldShowButton(), toggleBlockquote(), useBlockquote(), UseBlockquoteConfig, canToggle(), shouldShowButton(), toggleCodeBlock() (+14 more)

### Community 15 - "TipTap Undo Redo"
Cohesion: 0.13
Nodes (10): useCursorVisibility(), useWindowSize(), WindowSizeState, HorizontalRule, KnowledgeBaseEditor(), MainToolbarContent(), MobileToolbarContent(), SimpleEditor() (+2 more)

### Community 16 - "Tag Management Pages"
Cohesion: 0.16
Nodes (18): CloudUploadIcon(), DropZoneContent(), Commands, ImageUploadNode, ImageUploadNodeOptions, UploadFunction, FileCornerIcon(), FileIcon() (+10 more)

### Community 17 - "Account List Components"
Cohesion: 0.16
Nodes (11): { POST, GET }, signOut(), updatePassword(), auth, config, proxy(), updateSession(), createSupabaseServerClient() (+3 more)

### Community 18 - "Tag Selector Component"
Cohesion: 0.19
Nodes (18): findNodeAtPosition(), focusNextNode(), formatShortcutKey(), getSelectedNodesOfType(), handleImageUpload(), isAllowedUri(), isMac(), MAC_SYMBOLS (+10 more)

### Community 19 - "TipTap Heading Dropdown"
Cohesion: 0.22
Nodes (12): CursorVisibilityOptions, ElementRectOptions, initialRect, isClientSide(), RectState, useBodyRect(), useElementRect(), useRefRect() (+4 more)

### Community 20 - "TipTap Image Upload"
Cohesion: 0.22
Nodes (13): Redo2Icon, SvgProps, SvgProps, Undo2Icon, canExecuteUndoRedoAction(), executeUndoRedoAction(), historyActionLabels, historyIcons (+5 more)

### Community 21 - "TipTap Color Utilities"
Cohesion: 0.25
Nodes (7): EditorToolbar, EditorToolbarProps, KnowledgeBaseEditor(), MenuBarState, menuBarStateSelector(), ToolbarButton, ToolbarButtonProps

### Community 22 - "Authentication Routes"
Cohesion: 0.3
Nodes (6): AccountCard(), AccountList(), AccountListSkeleton(), CreateAccountDialog(), EmptyState(), AccountsPage()

### Community 23 - "Dashboard Layout"
Cohesion: 0.29
Nodes (5): ThemeToggle(), MoonStarIcon, SvgProps, SunIcon, SvgProps

### Community 24 - "TipTap Heading Buttons"
Cohesion: 0.32
Nodes (10): Tooltip(), TooltipContent, TooltipContentProps, TooltipContext, TooltipContextValue, TooltipProviderProps, TooltipTrigger, TooltipTriggerProps (+2 more)

### Community 25 - "TipTap Color Popover"
Cohesion: 0.39
Nodes (5): geistMono, geistSans, metadata, RootLayout(), ThemeProvider()

### Community 26 - "TipTap Editor Toolbar"
Cohesion: 0.33
Nodes (5): IconComponent, IconProps, ImageShortcutBadge(), ImageUploadButton, ImageUploadButtonProps

### Community 27 - "UI Sheet Component"
Cohesion: 0.33
Nodes (5): IconComponent, IconProps, TextAlignButton, TextAlignButtonProps, TextAlignShortcutBadge()

### Community 28 - "UI Tooltip Component"
Cohesion: 0.38
Nodes (3): MarkButton, MarkButtonProps, MarkShortcutBadge()

### Community 29 - "Theme Toggle Component"
Cohesion: 0.53
Nodes (4): EventTargetWithScroll, ScrollTarget, useScrolling(), UseScrollingOptions

### Community 30 - "UI Popover Component"
Cohesion: 0.33
Nodes (5): Architecture, code:block1 (prisma/              # Schema + migrations), Commands, Directory Layout, Key Patterns

### Community 31 - "Note Page and Editor"
Cohesion: 0.6
Nodes (3): Spacer(), SpacerOrientation, SpacerProps

### Community 32 - "App Metadata and Fonts"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **10 isolated node(s):** `config`, `nextConfig`, `{ POST, GET }`, `code:bash (npm run dev)`, `Learn More` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button()` connect `Account Management` to `TipTap Blockquote Actions`, `UI Button Components`, `Trade List Views`, `TipTap Toolbar Icons`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `cn()` connect `UI Button Components` to `Account Management`, `Trade List Views`, `TipTap Color Utilities`, `TipTap Toolbar Icons`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `Input()` connect `Account Management` to `TipTap Blockquote Actions`, `UI Button Components`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `config`, `nextConfig`, `{ POST, GET }` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Account Management` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `TipTap Blockquote Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `TipTap Editor Extensions` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._