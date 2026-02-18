# Out of Scope - Post-MVP Features

This document outlines features and enhancements that are intentionally excluded from the MVP (Minimum Viable Product) release. These features can be considered for future iterations.

## Collaboration & Multi-User Features

### Multi-Reviewer Support
- **Description**: Allow multiple reviewers to comment simultaneously with identity tracking
- **MVP Status**: Only single-reviewer mode implemented
- **Complexity**: Medium-High
- **Requirements**:
  - User authentication system
  - Reviewer identity management
  - Comment attribution and threading
  - Conflict resolution for simultaneous edits

### Real-Time Collaboration
- **Description**: Enable multiple users to edit and view slides simultaneously
- **MVP Status**: Not implemented
- **Complexity**: High
- **Requirements**:
  - WebSocket infrastructure
  - Operational transformation or CRDT for conflict resolution
  - Presence indicators (who's viewing/editing)
  - Live cursor positions

### Comment Threading & Replies
- **Description**: Allow reviewers to reply to comments and create discussion threads
- **MVP Status**: Single-level comments only
- **Complexity**: Medium
- **Requirements**:
  - Nested comment data structure
  - Reply UI components
  - Notification system for replies

## Edit & Modification Features

### Edit Mode with AI Refinement
- **Description**: Dedicated edit page where users can modify slides with AI assistance
- **MVP Status**: Route exists but not implemented
- **Complexity**: Medium
- **Requirements**:
  - `/deck/[id]/edit` page implementation
  - Side-by-side preview (current vs. modified)
  - Apply/Discard change workflow
  - Slide-specific prompt input

### Manual HTML Editing
- **Description**: Allow users to directly edit the HTML/CSS of slides
- **MVP Status**: Not implemented (AI-only modifications)
- **Complexity**: Medium
- **Requirements**:
  - Code editor component (e.g., Monaco Editor)
  - Syntax highlighting
  - Real-time preview
  - HTML/CSS validation

### Undo/Redo History
- **Description**: Track changes and allow users to revert to previous versions
- **MVP Status**: Not implemented
- **Complexity**: Medium
- **Requirements**:
  - Version tracking system
  - Diff visualization
  - Rollback mechanism
  - Storage of historical versions

## Review Features

### Review Mode Implementation
- **Description**: Full implementation of the review page with comment overlay
- **MVP Status**: Route exists but not implemented
- **Complexity**: High
- **Requirements**:
  - `/deck/[id]/review` page
  - `CommentOverlay` component
  - Element selector detection
  - Comment pin visualization
  - Comment sidebar with filters

### Inline Comments on Specific Elements
- **Description**: Click any element to add targeted comments
- **MVP Status**: Not implemented
- **Complexity**: Medium-High
- **Requirements**:
  - DOM element detection on hover
  - CSS selector generation
  - Visual comment indicators
  - Coordinate-based fallback

### Comment Resolution Status
- **Description**: Mark comments as resolved/unresolved with visual indicators
- **MVP Status**: Data structure exists but UI not implemented
- **Complexity**: Low-Medium
- **Requirements**:
  - Resolve/unresolve toggle UI
  - Visual differentiation (color coding)
  - Filter by resolution status

## Theme & Customization Features

### Theme Editor Implementation
- **Description**: Visual UI for customizing brand colors, fonts, and logos
- **MVP Status**: Route exists but not implemented
- **Complexity**: Medium
- **Requirements**:
  - `/deck/[id]/settings` page
  - Color picker components
  - Font selector (Google Fonts integration)
  - Logo upload functionality
  - Live preview of theme changes
  - "Regenerate slides with new theme" option

### Template Library
- **Description**: Pre-built slide layouts and templates
- **MVP Status**: Not implemented
- **Complexity**: Medium
- **Requirements**:
  - Template storage system
  - Template preview gallery
  - Template application to slides
  - Custom template creation

### Logo Positioning & Sizing
- **Description**: Dynamic logo placement on slides
- **MVP Status**: Configuration exists but not applied to generated slides
- **Complexity**: Low-Medium
- **Requirements**:
  - Logo rendering in SlideRenderer
  - Position calculation (top-left, top-right, etc.)
  - Size scaling (small, medium, large)

## Export & Sharing Features

### PDF Export
- **Description**: Export presentations as PDF files
- **MVP Status**: Not implemented (HTML export only)
- **Complexity**: Medium
- **Requirements**:
  - Headless browser rendering (Puppeteer/Playwright)
  - Page break handling
  - Print-optimized styling
  - Server-side rendering

### PowerPoint Export
- **Description**: Convert HTML slides to .pptx format
- **MVP Status**: Not implemented
- **Complexity**: High
- **Requirements**:
  - HTML-to-PPTX conversion library
  - Layout mapping
  - Style preservation
  - Compatibility testing with PowerPoint

### Custom Domain for Share Links
- **Description**: Use branded domain for shared presentations
- **MVP Status**: Uses localhost/production domain
- **Complexity**: Low-Medium
- **Requirements**:
  - Domain configuration
  - URL shortening service (optional)
  - Custom branding

### Share Link Expiration
- **Description**: Set expiration dates for shared links
- **MVP Status**: Permanent share links only
- **Complexity**: Low
- **Requirements**:
  - Expiration date field in share tokens
  - Cleanup job for expired links
  - Expiration UI in share settings

### Password-Protected Shares
- **Description**: Add password protection to shared links
- **MVP Status**: Public read-only shares only
- **Complexity**: Medium
- **Requirements**:
  - Password hashing and storage
  - Authentication flow for shared links
  - Password management UI

## Storage & Infrastructure

### Cloud Storage
- **Description**: Store slides in cloud services (S3, Google Drive, etc.)
- **MVP Status**: Local filesystem only
- **Complexity**: Medium-High
- **Requirements**:
  - Cloud storage integration (AWS S3, GCS, Azure Blob)
  - File sync mechanism
  - Access control and permissions
  - Migration from local storage

### Database Backend
- **Description**: Use database instead of JSON files
- **MVP Status**: JSON files in filesystem
- **Complexity**: Medium
- **Requirements**:
  - Database schema design (PostgreSQL, MongoDB, etc.)
  - ORM/query builder
  - Migration scripts
  - Connection pooling and optimization

### User Authentication
- **Description**: User accounts and authentication
- **MVP Status**: No authentication (single user)
- **Complexity**: High
- **Requirements**:
  - Auth provider integration (NextAuth, Clerk, Auth0)
  - User registration/login flows
  - Session management
  - User-specific data isolation

## Deck Management Features

### Deck Duplication
- **Description**: Clone existing decks
- **MVP Status**: Function exists but not exposed in UI
- **Complexity**: Low
- **Requirements**:
  - "Duplicate" button in dashboard
  - Copy all slides and comments
  - Rename dialog

### Deck Renaming
- **Description**: Edit deck title after creation
- **MVP Status**: Function exists but not exposed in UI
- **Complexity**: Low
- **Requirements**:
  - Inline editing or modal dialog
  - Update metadata
  - Validation

### Deck Organization
- **Description**: Folders, tags, and categorization
- **MVP Status**: Flat list of all decks
- **Complexity**: Medium
- **Requirements**:
  - Folder/tag data structure
  - Drag-and-drop organization
  - Search and filter by category
  - Breadcrumb navigation

### Deck Search
- **Description**: Search decks by title or content
- **MVP Status**: Not implemented
- **Complexity**: Low-Medium
- **Requirements**:
  - Search input in dashboard
  - Full-text search implementation
  - Search result highlighting

## Presentation Features

### Speaker Notes
- **Description**: Add presenter notes for each slide
- **MVP Status**: Not implemented
- **Complexity**: Medium
- **Requirements**:
  - Notes editor UI
  - Notes storage structure
  - Presenter view showing notes
  - Toggle notes visibility

### Presentation Timer
- **Description**: Track presentation time and time per slide
- **MVP Status**: Not implemented
- **Complexity**: Low
- **Requirements**:
  - Timer UI component
  - Start/stop/reset controls
  - Per-slide timing tracking
  - Total time display

### Thumbnail Grid View
- **Description**: View all slides as thumbnails for quick navigation
- **MVP Status**: Mentioned in SlideNavigation but not implemented
- **Complexity**: Medium
- **Requirements**:
  - Thumbnail generation
  - Grid layout overlay
  - Click to jump to slide
  - Current slide highlight

### Slide Transitions
- **Description**: Animated transitions between slides
- **MVP Status**: Simple fade implemented
- **Complexity**: Low-Medium
- **Requirements**:
  - Transition type selector
  - CSS animation library
  - Configurable duration and easing

## Analytics & Insights

### Presentation Analytics
- **Description**: Track viewing time, slide engagement, etc.
- **MVP Status**: Not implemented
- **Complexity**: Medium-High
- **Requirements**:
  - Event tracking system
  - Analytics dashboard
  - Data visualization
  - Privacy considerations

### View Count & Sharing Stats
- **Description**: Track how many times slides were viewed
- **MVP Status**: Not implemented
- **Complexity**: Low-Medium
- **Requirements**:
  - View counter in share links
  - Stats display in dashboard
  - Unique visitor tracking (IP or cookie)

### AI Suggestions
- **Description**: AI-powered recommendations for improving slides
- **MVP Status**: Not implemented
- **Complexity**: High
- **Requirements**:
  - Slide analysis with AI
  - Suggestion generation
  - UI for displaying suggestions
  - Apply suggestion workflow

## Integration Features

### Slack/Teams Integration
- **Description**: Share presentations directly to Slack or Microsoft Teams
- **MVP Status**: Not implemented
- **Complexity**: Medium
- **Requirements**:
  - OAuth integration with platforms
  - Share button with platform selector
  - Unfurl preview for shared links
  - Notification system

### API Access
- **Description**: REST API for programmatic access
- **MVP Status**: Only internal API routes
- **Complexity**: Medium
- **Requirements**:
  - API key management
  - Rate limiting
  - API documentation
  - SDK/client libraries

### Import from PowerPoint
- **Description**: Convert existing .pptx files to HTML slides
- **MVP Status**: Not implemented
- **Complexity**: Very High
- **Requirements**:
  - PowerPoint parsing library
  - Layout conversion algorithms
  - Style mapping
  - Asset extraction

### Import from PDF
- **Description**: Convert PDF presentations to editable slides
- **MVP Status**: Not implemented
- **Complexity**: High
- **Requirements**:
  - PDF parsing and text extraction
  - Image extraction
  - Layout detection
  - OCR for scanned PDFs

## Quality of Life Features

### Keyboard Shortcuts
- **Description**: Comprehensive keyboard shortcuts for all actions
- **MVP Status**: Only navigation shortcuts implemented (arrow keys, space)
- **Complexity**: Low
- **Requirements**:
  - Shortcut registry
  - Help overlay (? key)
  - Customizable shortcuts
  - Conflict detection

### Dark Mode
- **Description**: Dark theme for the application UI
- **MVP Status**: Not implemented (Scandinavian light design only)
- **Complexity**: Low-Medium
- **Requirements**:
  - Dark theme color palette
  - Theme toggle UI
  - CSS variable system
  - Persistence of preference

### Accessibility Improvements
- **Description**: Enhanced screen reader support, keyboard navigation, etc.
- **MVP Status**: Basic accessibility only
- **Complexity**: Medium
- **Requirements**:
  - ARIA labels and roles
  - Focus management
  - High contrast mode
  - Skip navigation links

### Responsive Mobile View
- **Description**: Optimized experience for mobile devices
- **MVP Status**: Desktop-focused design
- **Complexity**: Medium
- **Requirements**:
  - Mobile-optimized layouts
  - Touch gesture support
  - Responsive sidebar
  - Mobile presentation mode

### Offline Support
- **Description**: Work on presentations without internet connection
- **MVP Status**: Requires internet for AI generation
- **Complexity**: High
- **Requirements**:
  - Service worker for caching
  - IndexedDB for local storage
  - Sync mechanism when online
  - Offline indicator

## Advanced AI Features

### AI Content Suggestions
- **Description**: AI suggests content for slides based on topic
- **MVP Status**: User must describe all content
- **Complexity**: High
- **Requirements**:
  - Content generation API
  - Research/web search integration
  - Citation tracking
  - Fact-checking

### Image Generation
- **Description**: AI-generated images for slides (DALL-E, Midjourney, etc.)
- **MVP Status**: No image generation
- **Complexity**: High
- **Requirements**:
  - Image generation API integration
  - Prompt refinement UI
  - Image storage and optimization
  - Copyright compliance

### Automatic Slide Design Optimization
- **Description**: AI analyzes and improves slide layouts automatically
- **MVP Status**: User must prompt for changes
- **Complexity**: High
- **Requirements**:
  - Design analysis algorithms
  - Layout optimization rules
  - Visual hierarchy detection
  - A/B testing for effectiveness

### Multiple AI Model Support
- **Description**: Choose between different AI models (GPT, Claude, Gemini)
- **MVP Status**: Gemini only
- **Complexity**: Medium
- **Requirements**:
  - Model selector UI
  - Unified API interface
  - Model-specific prompt optimization
  - Cost tracking per model

## Performance & Optimization

### Lazy Loading of Slides
- **Description**: Load slides on-demand for large presentations
- **MVP Status**: All slides loaded at once
- **Complexity**: Medium
- **Requirements**:
  - Lazy loading implementation
  - Preloading adjacent slides
  - Loading indicators
  - Memory management

### Image Optimization
- **Description**: Automatic compression and resizing of images
- **MVP Status**: No image handling
- **Complexity**: Low-Medium
- **Requirements**:
  - Image processing library (Sharp, Jimp)
  - Automatic format conversion (WebP)
  - Responsive image sizes
  - CDN integration

### Caching Strategy
- **Description**: Cache AI responses and generated slides
- **MVP Status**: No caching
- **Complexity**: Medium
- **Requirements**:
  - Cache key generation
  - Cache invalidation strategy
  - Redis or similar cache storage
  - Cache hit rate monitoring

## Enterprise Features

### Team Workspaces
- **Description**: Organization-level workspaces with shared decks
- **MVP Status**: Single user only
- **Complexity**: High
- **Requirements**:
  - Organization management
  - Team member invitations
  - Role-based access control
  - Billing per workspace

### Custom Branding
- **Description**: White-label the application with company branding
- **MVP Status**: Fixed branding
- **Complexity**: Medium
- **Requirements**:
  - Configurable logo and colors
  - Custom domain support
  - Branded email notifications
  - Theme customization

### SSO Integration
- **Description**: Single sign-on with corporate identity providers
- **MVP Status**: No authentication
- **Complexity**: High
- **Requirements**:
  - SAML/OAuth integration
  - Identity provider connectors
  - User provisioning
  - Access control policies

### Audit Logs
- **Description**: Track all actions for compliance
- **MVP Status**: No logging
- **Complexity**: Medium
- **Requirements**:
  - Event logging system
  - Log storage and retention
  - Audit log viewer
  - Export capabilities

## Deployment & DevOps

### Monitoring & Alerting
- **Description**: Application monitoring and error tracking
- **MVP Status**: Console logging only
- **Complexity**: Low-Medium
- **Requirements**:
  - Error tracking (Sentry, Rollbar)
  - Performance monitoring (New Relic, Datadog)
  - Uptime monitoring
  - Alert configuration

### CI/CD Pipeline
- **Description**: Automated testing and deployment
- **MVP Status**: Manual deployment
- **Complexity**: Medium
- **Requirements**:
  - GitHub Actions or similar
  - Automated tests (unit, integration, e2e)
  - Staging environment
  - Deployment automation

### Backup & Disaster Recovery
- **Description**: Automated backups and recovery procedures
- **MVP Status**: No backup system
- **Complexity**: Medium
- **Requirements**:
  - Automated backup schedule
  - Backup verification
  - Recovery testing
  - Geographic redundancy

---

## Priority Recommendations

### High Priority (Next Sprint)
1. **Review Mode Implementation** - Core feature mentioned in original plan
2. **Edit Mode with AI Refinement** - Essential for slide modification workflow
3. **Theme Editor Implementation** - Allows users to customize branding

### Medium Priority (Future Iterations)
1. **PDF Export** - Common requirement for consultants
2. **Deck Duplication & Renaming** - Basic management features
3. **Multi-Reviewer Support** - Scales the review workflow
4. **Speaker Notes** - Useful for presentations

### Low Priority (Nice to Have)
1. **Dark Mode** - Aesthetic preference
2. **Keyboard Shortcuts Extension** - Power user feature
3. **Analytics** - Valuable but not essential for MVP
4. **Mobile Optimization** - Desktop-first approach is acceptable initially

---

## Contributing

If you'd like to implement any of these features, please:
1. Open an issue to discuss the approach
2. Reference this document in your PR
3. Update this document to move the feature out of "Out of Scope"

---

**Last Updated**: 2026-02-18
**Version**: 1.0.0
