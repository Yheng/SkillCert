# SQLite Backend

**Component**: SQLite Backend  
**Date**: August 9, 2025  
**Reference**: `docs/front-end-architecture.md`

## Overview
Manages user profiles and task metadata in SQLite, with encrypted storage.

## Requirements
- **Endpoints**:
  - `/api/users`: CRUD for profiles.
  - `/api/tasks`: CRUD for task metadata.
- **Security**: Encrypt SQLite data with bcrypt.
- **Performance**: Queries <100ms with indexing.
- **Dependencies**: `npm install sqlite3`.

## Implementation
- Setup Node.js/Express server (`server/index.js`).
- Initialize SQLite database with encrypted tables.
- Implement CRUD in `api/user.js` and `api/task.js`.