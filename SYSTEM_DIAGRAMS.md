# Tree Inventory System - Visual Architecture

## System Overview Diagram

```mermaid
graph TB
    subgraph "User Interface"
        A[Web Browser]
    end
    
    subgraph "Frontend - GitHub Pages"
        B[React Application]
        C[Material-UI Components]
        D[React Router]
    end
    
    subgraph "Firebase Services"
        E[Firebase Authentication]
        F[Cloud Firestore]
        G[Firebase Storage]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    B --> G
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style E fill:#c8e6c9
    style F fill:#c8e6c9
    style G fill:#c8e6c9
```

## Application Architecture

```mermaid
graph LR
    subgraph "Client Side"
        A[React Components]
        B[React Query Cache]
        C[Auth Context]
    end
    
    subgraph "Services Layer"
        D[Firebase Service]
        E[Trees Service]
        F[Auth Service]
    end
    
    subgraph "Firebase Backend"
        G[Firestore DB]
        H[Storage]
        I[Auth]
    end
    
    A --> B
    A --> C
    A --> E
    A --> F
    E --> D
    F --> D
    D --> G
    D --> H
    D --> I
    
    style A fill:#bbdefb
    style B fill:#c5cae9
    style C fill:#c5cae9
    style D fill:#fff9c4
    style E fill:#fff9c4
    style F fill:#fff9c4
    style G fill:#c8e6c9
    style H fill:#c8e6c9
    style I fill:#c8e6c9
```

## User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as React App
    participant F as Firebase Auth
    participant D as Firestore
    
    U->>A: Visit Application
    A->>F: Check Auth State
    F-->>A: Not Authenticated
    A->>U: Show Login Page
    U->>A: Enter Credentials
    A->>F: Sign In Request
    F-->>A: Auth Token
    A->>D: Fetch User Profile
    D-->>A: User Data + Role
    A->>U: Redirect to Dashboard
```

## Tree Lifecycle Workflow

```mermaid
stateDiagram-v2
    [*] --> Ordered: Purchase from Supplier
    Ordered --> InTransit: Shipment Initiated
    InTransit --> InNursery: Arrival at Nursery
    InNursery --> ReadyToPlant: Health Check Passed
    ReadyToPlant --> Planted: Planted at Site
    Planted --> Monitoring: Ongoing Care
    
    InNursery --> Deceased: Health Failed
    Planted --> Deceased: Did Not Survive
    Monitoring --> [*]: End of Tracking
    Deceased --> [*]: Removed from Inventory
```

## Data Model Relationships

```mermaid
erDiagram
    USERS ||--o{ TREES : creates
    SUPPLIERS ||--o{ TREES : provides
    NURSERY_LOCATIONS ||--o{ TREES : stores
    PLANTING_SITES ||--o{ TREES : receives
    
    TREES ||--o{ MEASUREMENTS : has
    TREES ||--o{ MAINTENANCE : requires
    TREES ||--o{ DISEASES : suffers
    TREES ||--o{ PHOTOS : includes
    
    USERS {
        string uid PK
        string email
        string role
        timestamp createdAt
    }
    
    TREES {
        string id PK
        string species
        string status
        string healthStatus
        string supplierId FK
        string nurseryLocationId FK
        string plantingSiteId FK
    }
    
    MEASUREMENTS {
        string id PK
        string treeId FK
        number height
        number diameter
        timestamp date
    }
    
    MAINTENANCE {
        string id PK
        string treeId FK
        string type
        timestamp date
    }
    
    DISEASES {
        string id PK
        string treeId FK
        string name
        string severity
        string status
    }
```

## Component Hierarchy

```mermaid
graph TD
    A[App.tsx] --> B[AuthProvider]
    B --> C[Router]
    C --> D[AppLayout]
    
    D --> E[Header]
    D --> F[Sidebar]
    D --> G[Main Content]
    D --> H[Footer]
    
    G --> I[Dashboard]
    G --> J[TreeList]
    G --> K[TreeDetail]
    G --> L[TreeForm]
    G --> M[Suppliers]
    G --> N[Locations]
    
    J --> O[TreeCard]
    J --> P[TreeFilters]
    
    K --> Q[TreeInfo]
    K --> R[MeasurementChart]
    K --> S[MaintenanceList]
    K --> T[DiseaseList]
    K --> U[PhotoGallery]
    
    style A fill:#e1bee7
    style B fill:#ce93d8
    style C fill:#ba68c8
    style D fill:#ab47bc
    style G fill:#9c27b0
```

## Data Flow - Creating a Tree

```mermaid
sequenceDiagram
    participant U as User
    participant C as TreeForm Component
    participant S as Trees Service
    participant F as Firestore
    participant Q as React Query
    
    U->>C: Fill Form & Submit
    C->>C: Validate Input
    C->>S: createTree(data)
    S->>F: addDoc(trees, data)
    F-->>S: Document ID
    S-->>C: Success
    C->>Q: Invalidate Cache
    Q->>F: Refetch Trees
    F-->>Q: Updated List
    Q-->>C: New Data
    C->>U: Show Success & Redirect
```

## Photo Upload Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as PhotoUpload Component
    participant S as Storage Service
    participant FS as Firebase Storage
    participant DB as Firestore
    
    U->>C: Select Photo
    C->>C: Validate (size, type)
    C->>C: Compress Image
    C->>S: uploadPhoto(file, treeId)
    S->>FS: Upload to /tree-photos/{treeId}/
    FS-->>S: Download URL
    S->>DB: Update tree.photoUrls[]
    DB-->>S: Success
    S-->>C: Photo URL
    C->>U: Display Photo
```

## Real-Time Updates Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant U2 as User 2
    participant A1 as App Instance 1
    participant A2 as App Instance 2
    participant F as Firestore
    
    U1->>A1: Update Tree Health
    A1->>F: updateDoc(tree)
    F-->>A1: Success
    F->>A2: Real-time Listener Triggered
    A2->>A2: Update Local State
    A2->>U2: Display Updated Health
    
    Note over A1,A2: Both users see changes instantly
```

## Security Rules Architecture

```mermaid
graph TB
    A[Client Request] --> B{Authenticated?}
    B -->|No| C[Deny Access]
    B -->|Yes| D{Check Role}
    
    D --> E{Admin?}
    D --> F{Editor?}
    D --> G{Viewer?}
    
    E -->|Yes| H[Full Access]
    F -->|Yes| I[Read + Write]
    G -->|Yes| J[Read Only]
    
    H --> K[Allow Operation]
    I --> L{Write Operation?}
    J --> M{Read Operation?}
    
    L -->|Yes| K
    L -->|No| C
    M -->|Yes| K
    M -->|No| C
    
    style A fill:#e3f2fd
    style B fill:#fff9c4
    style D fill:#fff9c4
    style K fill:#c8e6c9
    style C fill:#ffcdd2
```

## Deployment Pipeline

```mermaid
graph LR
    A[Local Development] --> B[Git Commit]
    B --> C[Push to GitHub]
    C --> D{GitHub Actions}
    
    D --> E[Install Dependencies]
    E --> F[Run Tests]
    F --> G[Build Production]
    G --> H[Deploy to gh-pages]
    H --> I[GitHub Pages]
    I --> J[Live Application]
    
    F -->|Tests Fail| K[Notify Developer]
    K --> A
    
    style A fill:#e1f5fe
    style D fill:#fff9c4
    style I fill:#c8e6c9
    style J fill:#a5d6a7
    style K fill:#ffcdd2
```

## Mobile Responsive Layout

```
┌─────────────────────────────────────┐
│  Desktop (>960px)                   │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │   Main Content           │
│          │                          │
│ - Trees  │   ┌──────┬──────┬──────┐│
│ - Dash   │   │ Card │ Card │ Card ││
│ - Supp   │   └──────┴──────┴──────┘│
│ - Loc    │   ┌──────┬──────┬──────┐│
│          │   │ Card │ Card │ Card ││
│          │   └──────┴──────┴──────┘│
└──────────┴──────────────────────────┘

┌─────────────────────┐
│  Tablet (600-960px) │
├─────────────────────┤
│  ☰ Menu   🌳 Title  │
├─────────────────────┤
│  ┌────────┬────────┐│
│  │  Card  │  Card  ││
│  └────────┴────────┘│
│  ┌────────┬────────┐│
│  │  Card  │  Card  ││
│  └────────┴────────┘│
└─────────────────────┘

┌──────────────┐
│ Mobile (<600)│
├──────────────┤
│ ☰  🌳 Title  │
├──────────────┤
│ ┌──────────┐ │
│ │   Card   │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │   Card   │ │
│ └──────────┘ │
│ ┌──────────┐ │
│ │   Card   │ │
│ └──────────┘ │
└──────────────┘
```

## Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  🌳 Tree Inventory Dashboard                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │   Total  │  │   In     │  │  Planted │  │ Critical││
│  │   Trees  │  │  Nursery │  │          │  │  Health ││
│  │   1,234  │  │    456   │  │    678   │  │    12   ││
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│                                                         │
│  ┌─────────────────────────┐  ┌─────────────────────┐ │
│  │  Health Distribution    │  │  Recent Activities  │ │
│  │                         │  │                     │ │
│  │  [Pie Chart]            │  │  • Tree #123 added  │ │
│  │                         │  │  • Watering done    │ │
│  │                         │  │  • Disease detected │ │
│  └─────────────────────────┘  └─────────────────────┘ │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  Growth Over Time                                 │ │
│  │                                                   │ │
│  │  [Line Chart showing height measurements]        │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Tree Detail View Layout

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to List          Red Oak (Quercus rubra)   [Edit]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │                 │  │  Status: In Nursery         │ │
│  │  [Tree Photo]   │  │  Health: Excellent          │ │
│  │                 │  │  Location: Section A-12     │ │
│  │                 │  │  Supplier: Green Nursery    │ │
│  └─────────────────┘  │  Arrived: 2024-03-15        │ │
│                       └─────────────────────────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │  📊 Measurements  🔧 Maintenance  🦠 Diseases  📝 Notes││
│  ├─────────────────────────────────────────────────────┤│
│  │                                                     ││
│  │  [Growth Chart]                                     ││
│  │                                                     ││
│  │  Latest: Height 2.5m, Diameter 8cm (2024-04-01)    ││
│  │                                                     ││
│  │  [Add New Measurement]                              ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## File Structure Visualization

```
tree-inventory/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── PasswordReset.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── trees/
│   │   │   ├── TreeList.tsx
│   │   │   ├── TreeCard.tsx
│   │   │   ├── TreeDetail.tsx
│   │   │   └── TreeForm.tsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── StatisticsCards.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── firebase.ts
│   │   ├── auth.service.ts
│   │   └── trees.service.ts
│   ├── types/
│   │   └── tree.types.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.local (not committed)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Performance Optimization Strategy

```mermaid
graph TD
    A[Initial Load] --> B[Code Splitting]
    B --> C[Lazy Load Routes]
    C --> D[Reduce Bundle Size]
    
    E[Data Fetching] --> F[React Query Cache]
    F --> G[Optimistic Updates]
    G --> H[Reduce API Calls]
    
    I[Images] --> J[Compress on Upload]
    J --> K[Lazy Load Images]
    K --> L[Responsive Images]
    
    M[Rendering] --> N[Memoization]
    N --> O[Virtual Scrolling]
    O --> P[Debounce Search]
    
    style A fill:#ffebee
    style E fill:#e3f2fd
    style I fill:#f3e5f5
    style M fill:#e8f5e9
```

---

## Legend

### Diagram Types Used

- **Graph TB/LR**: System architecture and relationships
- **Sequence Diagram**: Process flows and interactions
- **State Diagram**: Workflow states and transitions
- **ER Diagram**: Database relationships
- **Flowchart**: Decision trees and logic flows

### Color Coding

- 🔵 Blue: User interface and client-side
- 🟡 Yellow: Services and middleware
- 🟢 Green: Backend and database
- 🔴 Red: Errors and failures
- 🟣 Purple: Components and React

---

These diagrams provide visual representations of the system architecture, data flows, and user interactions. Use them alongside the written documentation for a complete understanding of the application structure.