# Architecture 

This document explains the technical architecture for the multi-tenant inventory management system.

## 1. Multi-Tenancy Approach

### Shared Database, Shared Collections

1. All tenants share the same MongoDB database
2. Every tenant-specific document contains a tenantId
3. All queries are scoped by tenantId

### Enforcement
- tenantId is injected via JWT
- tenantMiddleware ensures all queries are tenant-safe
- No API allows passing tenantId manually from client

## 2. Authentication & Authorization

### Authentication
- JWT-based authentication
- Token payload includes:
  - userId
  - tenantId
  - role

### Authorization
- Role-based access control:
  - OWNER
  - MANAGER
  - STAFF
- roleMiddleware restricts sensitive operations

## 3. Data Modeling Decisions

### Models
- Tenant
- User
- Product
- Supplier
- PurchaseOrder
- Order
- StockMovement

### Product Design
- Product contains multiple variants
- Variant stores stock & reorder level

## 4. Stock Management Strategy

### Process
  - Purchase Orders (IN)
  - Inventory Orders (OUT)

### Stock Ledger
- Every stock change creates a StockMovement

## 5. Scalability Considerations

### Horizontal Scaling
- Stateless backend
- JWT authentication
- Ready for load balancer


## 6. Why This Architecture plan?

This architecture prioritizes:
- Data correctness
- Simplicity
- Real-world inventory accuracy
