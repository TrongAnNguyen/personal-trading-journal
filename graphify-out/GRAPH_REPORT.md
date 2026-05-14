# Graph Report - src  (2026-05-13)

## Corpus Check
- Large corpus: 224 files · ~54,166 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 873 nodes · 1826 edges · 51 communities (46 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

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
- [[_COMMUNITY_UI Tooltip Component|UI Tooltip Component]]
- [[_COMMUNITY_Theme Toggle Component|Theme Toggle Component]]
- [[_COMMUNITY_UI Popover Component|UI Popover Component]]
- [[_COMMUNITY_Note Page and Editor|Note Page and Editor]]
- [[_COMMUNITY_App Metadata and Fonts|App Metadata and Fonts]]
- [[_COMMUNITY_TipTap Image Button|TipTap Image Button]]
- [[_COMMUNITY_TipTap Text Align Button|TipTap Text Align Button]]
- [[_COMMUNITY_Knowledge Base Mentions|Knowledge Base Mentions]]
- [[_COMMUNITY_UI Tabs Component|UI Tabs Component]]
- [[_COMMUNITY_Tag Badge Components|Tag Badge Components]]
- [[_COMMUNITY_Trade Detail Pages|Trade Detail Pages]]
- [[_COMMUNITY_Middleware and Proxy|Middleware and Proxy]]
- [[_COMMUNITY_TipTap List Button|TipTap List Button]]
- [[_COMMUNITY_TipTap Undo Redo Button|TipTap Undo Redo Button]]
- [[_COMMUNITY_Scroll Hooks|Scroll Hooks]]
- [[_COMMUNITY_UI Spacer Component|UI Spacer Component]]
- [[_COMMUNITY_Trade Metrics|Trade Metrics]]
- [[_COMMUNITY_UI Badge Component|UI Badge Component]]

## God Nodes (most connected - your core abstractions)
1. `useTiptapEditor()` - 40 edges
2. `Button()` - 28 edges
3. `cn()` - 27 edges
4. `parseShortcutKeys()` - 20 edges
5. `Card()` - 19 edges
6. `isNodeTypeSelected()` - 19 edges
7. `CardHeader()` - 18 edges
8. `CardContent()` - 18 edges
9. `CardTitle()` - 15 edges
10. `isNodeInSchema()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `ListShortcutBadge()` --calls--> `parseShortcutKeys()`  [EXTRACTED]
  components/tiptap-editor/tiptap-ui/list-button/list-button.tsx → lib/tiptap-utils.ts
- `ImageShortcutBadge()` --calls--> `parseShortcutKeys()`  [EXTRACTED]
  components/tiptap-editor/tiptap-ui/image-upload-button/image-upload-button.tsx → lib/tiptap-utils.ts
- `HistoryShortcutBadge()` --calls--> `parseShortcutKeys()`  [EXTRACTED]
  components/tiptap-editor/tiptap-ui/undo-redo-button/undo-redo-button.tsx → lib/tiptap-utils.ts
- `TextAlignShortcutBadge()` --calls--> `parseShortcutKeys()`  [EXTRACTED]
  components/tiptap-editor/tiptap-ui/text-align-button/text-align-button.tsx → lib/tiptap-utils.ts
- `LinkMain()` --calls--> `useIsBreakpoint()`  [EXTRACTED]
  components/tiptap-editor/tiptap-ui/link-popover/link-popover.tsx → hooks/use-is-breakpoint.ts

## Communities (51 total, 5 thin omitted)

### Community 0 - "Account Management"
Cohesion: 0.06
Nodes (68): Account, AccountCardProps, CreateAccountInput, createAccountSchema, createTrade, EquityCurveChartProps, WinLossChartProps, AssetDetails() (+60 more)

### Community 1 - "TipTap Blockquote Actions"
Cohesion: 0.07
Nodes (51): canToggleBlockquote(), shouldShowButton(), toggleBlockquote(), useBlockquote(), UseBlockquoteConfig, canToggle(), shouldShowButton(), toggleCodeBlock() (+43 more)

### Community 2 - "TipTap Editor Extensions"
Cohesion: 0.05
Nodes (33): CursorVisibilityOptions, useCursorVisibility(), ElementRectOptions, initialRect, isClientSide(), RectState, useBodyRect(), useElementRect() (+25 more)

### Community 3 - "UI Button Components"
Cohesion: 0.05
Nodes (30): Button, ButtonGroup, ButtonProps, ButtonSize, ButtonVariant, Card, CardBody, CardFooter (+22 more)

### Community 4 - "Trade List Views"
Cohesion: 0.09
Nodes (18): formatPnL(), formatPrice(), TradeListRow(), TradeListRowProps, TradeListSkeleton(), TradeListTable(), TradeListTableProps, TradeList() (+10 more)

### Community 5 - "Account Pages and Skeletons"
Cohesion: 0.09
Nodes (20): AccountListSkeleton(), CreateAccountDialog(), getTrades, LiveTradesSkeleton(), MetricsSkeleton(), RecentActivitySkeleton(), LiveTrades(), MetricsGrid() (+12 more)

### Community 6 - "TipTap Toolbar Icons"
Cohesion: 0.09
Nodes (25): isMarkInSchema(), canToggleMark(), getFormattedMarkName(), isMarkActive(), Mark, MARK_SHORTCUT_KEYS, markIcons, shouldShowButton() (+17 more)

### Community 7 - "Trade Enums and Types"
Cohesion: 0.09
Nodes (29): AssetClass, AttachmentContext, Emotion, TagType, TradeSide, TradeStatus, Account, Attachment (+21 more)

### Community 8 - "TipTap Link Components"
Cohesion: 0.09
Nodes (22): LinkButton, LinkContent(), LinkMain(), LinkMainProps, LinkPopover, LinkPopoverProps, canSetLink(), isLinkActive() (+14 more)

### Community 9 - "TipTap Text Alignment"
Cohesion: 0.12
Nodes (20): isExtensionAvailable(), canSetTextAlign(), hasSetTextAlign(), isTextAlignActive(), setTextAlign(), shouldShowButton(), TEXT_ALIGN_SHORTCUT_KEYS, TextAlign (+12 more)

### Community 10 - "TipTap Action Buttons"
Cohesion: 0.13
Nodes (13): BlockquoteButton, BlockquoteButtonProps, BlockquoteShortcutBadge(), CodeBlockButton, CodeBlockButtonProps, CodeBlockShortcutBadge(), ColorHighlightButton, ColorHighlightButtonProps (+5 more)

### Community 11 - "Trade Server Actions"
Cohesion: 0.15
Nodes (13): createAccount, closeTrade, deleteTrade, input, mockCreatedTrade, mockTrade, mockTrades, now (+5 more)

### Community 12 - "TipTap List Management"
Cohesion: 0.14
Nodes (13): canToggleAnyList(), getActiveListType(), isAnyListActive(), ListOption, listOptions, useListDropdownMenu(), UseListDropdownMenuConfig, ListIcon (+5 more)

### Community 13 - "Knowledge Base Actions"
Cohesion: 0.18
Nodes (11): createNote(), deleteNote(), getGraph, getNotes, NoteWithMeta, updateNote(), getAuthenticatedUserId(), ForceGraph2D (+3 more)

### Community 14 - "TipTap Color Highlight"
Cohesion: 0.14
Nodes (12): ColorHighlightPopoverContent(), useComposedRef(), UserRef, MenuNavigationOptions, Orientation, useMenuNavigation(), BaseProps, Toolbar (+4 more)

### Community 15 - "TipTap Undo Redo"
Cohesion: 0.17
Nodes (13): Redo2Icon, SvgProps, SvgProps, Undo2Icon, canExecuteUndoRedoAction(), executeUndoRedoAction(), historyActionLabels, historyIcons (+5 more)

### Community 16 - "Tag Management Pages"
Cohesion: 0.19
Nodes (8): getTags(), CacheTag, CacheTTL, CreateTagDialog(), EmptyState(), TagGroup(), TagListSkeleton(), TagList()

### Community 17 - "Account List Components"
Cohesion: 0.2
Nodes (10): AccountCard(), AccountList(), EmptyState(), getAccounts, getDisciplineChecklist(), updateDisciplineChecklist(), NewTradePage(), DisciplineSettings() (+2 more)

### Community 18 - "Tag Selector Component"
Cohesion: 0.21
Nodes (9): createTag, TagSelector(), TagSelectorProps, Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+1 more)

### Community 19 - "TipTap Heading Dropdown"
Cohesion: 0.23
Nodes (7): HeadingDropdownMenu, HeadingDropdownMenuProps, useTiptapEditor(), ListDropdownMenu(), ListDropdownMenuProps, ChevronDownIcon, SvgProps

### Community 20 - "TipTap Image Upload"
Cohesion: 0.24
Nodes (10): BreakpointMode, useIsBreakpoint(), canInsertImage(), insertImage(), isImageActive(), shouldShowButton(), useImageUpload(), UseImageUploadConfig (+2 more)

### Community 21 - "TipTap Color Utilities"
Cohesion: 0.22
Nodes (11): canColorHighlight(), getHighlightColorValue(), HIGHLIGHT_COLORS, HighlightColor, HighlightMode, isColorHighlightActive(), removeHighlight(), shouldShowButton() (+3 more)

### Community 22 - "Authentication Routes"
Cohesion: 0.27
Nodes (7): signOut(), updatePassword(), SessionSettings(), createSupabaseServerClient(), ChangePasswordInput, changePasswordSchema, POST()

### Community 23 - "Dashboard Layout"
Cohesion: 0.2
Nodes (3): DashboardLayoutProps, cn(), reviveDates()

### Community 24 - "TipTap Heading Buttons"
Cohesion: 0.2
Nodes (8): HeadingButton, HeadingButtonProps, HeadingShortcutBadge(), getActiveHeadingLevel(), useHeadingDropdownMenu(), UseHeadingDropdownMenuConfig, HeadingIcon, SvgProps

### Community 25 - "TipTap Color Popover"
Cohesion: 0.2
Nodes (7): ColorHighlightPopoverButton, ColorHighlightPopoverContentProps, ColorHighlightPopoverProps, BanIcon, SvgProps, HighlighterIcon, SvgProps

### Community 26 - "TipTap Editor Toolbar"
Cohesion: 0.24
Nodes (6): EditorToolbar, EditorToolbarProps, MenuBarState, menuBarStateSelector(), ToolbarButton, ToolbarButtonProps

### Community 28 - "UI Tooltip Component"
Cohesion: 0.2
Nodes (9): Tooltip(), TooltipContent, TooltipContentProps, TooltipContext, TooltipContextValue, TooltipProviderProps, TooltipTrigger, TooltipTriggerProps (+1 more)

### Community 29 - "Theme Toggle Component"
Cohesion: 0.28
Nodes (5): ThemeToggle(), MoonStarIcon, SvgProps, SunIcon, SvgProps

### Community 30 - "UI Popover Component"
Cohesion: 0.25
Nodes (3): Popover(), PopoverContent(), PopoverTrigger()

### Community 31 - "Note Page and Editor"
Cohesion: 0.32
Nodes (4): getNote, generateMetadata(), NoteContent(), Note

### Community 32 - "App Metadata and Fonts"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, ThemeProvider()

### Community 34 - "TipTap Image Button"
Cohesion: 0.29
Nodes (5): IconComponent, IconProps, ImageShortcutBadge(), ImageUploadButton, ImageUploadButtonProps

### Community 35 - "TipTap Text Align Button"
Cohesion: 0.29
Nodes (5): IconComponent, IconProps, TextAlignButton, TextAlignButtonProps, TextAlignShortcutBadge()

### Community 38 - "Tag Badge Components"
Cohesion: 0.47
Nodes (4): TagBadge(), TagBadgeProps, Badge(), badgeVariants

### Community 39 - "Trade Detail Pages"
Cohesion: 0.4
Nodes (5): getTrade(), CloseTradePage(), CloseTradePageProps, TradeDetailPage(), CloseTradeForm()

### Community 40 - "Middleware and Proxy"
Cohesion: 0.6
Nodes (3): config, proxy(), updateSession()

### Community 41 - "TipTap List Button"
Cohesion: 0.4
Nodes (3): ListButton, ListButtonProps, ListShortcutBadge()

### Community 42 - "TipTap Undo Redo Button"
Cohesion: 0.4
Nodes (3): HistoryShortcutBadge(), UndoRedoButton, UndoRedoButtonProps

### Community 43 - "Scroll Hooks"
Cohesion: 0.4
Nodes (3): EventTargetWithScroll, ScrollTarget, UseScrollingOptions

## Knowledge Gaps
- **239 isolated node(s):** `config`, `createTradeSchema`, `CreateTradeInput`, `closeTradeSchema`, `CloseTradeInput` (+234 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button()` connect `Account Management` to `Trade List Views`, `Account Pages and Skeletons`, `Trade Detail Pages`, `Knowledge Base Actions`, `Account List Components`, `Tag Selector Component`, `Authentication Routes`, `Dashboard Layout`, `Note Page and Editor`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `cn()` connect `Dashboard Layout` to `Account Management`, `UI Avatar Component`, `Trade List Views`, `UI Tabs Component`, `Tag Badge Components`, `Account Pages and Skeletons`, `Knowledge Base Actions`, `Tag Selector Component`, `TipTap Editor Toolbar`, `UI Sheet Component`, `UI Popover Component`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `useTiptapEditor()` connect `TipTap Heading Dropdown` to `TipTap Blockquote Actions`, `TipTap Image Button`, `TipTap Text Align Button`, `TipTap Toolbar Icons`, `TipTap Link Components`, `TipTap List Button`, `TipTap Action Buttons`, `TipTap Undo Redo Button`, `TipTap Text Alignment`, `TipTap List Management`, `TipTap Undo Redo`, `TipTap Image Upload`, `TipTap Color Utilities`, `TipTap Heading Buttons`, `TipTap Color Popover`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **What connects `config`, `createTradeSchema`, `CreateTradeInput` to the rest of the system?**
  _239 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Account Management` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `TipTap Blockquote Actions` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `TipTap Editor Extensions` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._