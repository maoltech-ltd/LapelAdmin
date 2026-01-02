import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { roleService } from '../../api/services';

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoleState {
  roles: Role[];
  currentRole: Role | null;
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: RoleState = {
  roles: [],
  currentRole: null,
  permissions: [],
  loading: false,
  error: null,
  total: 0,
};

export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (params?: any) => {
    const response = await roleService.getRoles(params);
    return response.data;
  }
);

export const fetchRoleById = createAsyncThunk(
  'roles/fetchRoleById',
  async (id: string) => {
    const response = await roleService.getRoleById(id);
    return response.data;
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (data: { name: string; description?: string; permissions: string[] }) => {
    const response = await roleService.createRole(data);
    return response.data;
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, data }: { id: string; data: Partial<Role> }) => {
    const response = await roleService.updateRole(id, data);
    return response.data;
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id: string) => {
    const response = await roleService.deleteRole(id);
    return { id, ...response.data };
  }
);

export const fetchPermissions = createAsyncThunk(
  'roles/fetchPermissions',
  async () => {
    const response = await roleService.getPermissions();
    return response.data;
  }
);

export const updateRolePermissions = createAsyncThunk(
  'roles/updateRolePermissions',
  async ({ roleId, permissions }: { roleId: string; permissions: string[] }) => {
    const response = await roleService.updateRolePermissions(roleId, permissions);
    return response.data;
  }
);

export const manageRolePermission = createAsyncThunk(
  'roles/managePermission',
  async ({ roleId, permissionId, action }: { 
    roleId: string; 
    permissionId: string; 
    action: 'add' | 'remove' 
  }) => {
    const response = await roleService.manageRolePermissions(roleId, { 
      permissionId, 
      action 
    });
    return { roleId, permissionId, action, ...response.data };
  }
);

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearRoles: (state) => {
      state.roles = [];
      state.total = 0;
    },
    setCurrentRole: (state, action: PayloadAction<Role>) => {
      state.currentRole = action.payload;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.roles || action.payload.data || action.payload;
        state.total = action.payload.total || action.payload.count || state.roles.length;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch roles';
      })
      // Fetch role by ID
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch role';
      })
      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
        state.total += 1;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create role';
      })
      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedRole = action.payload;
        const index = state.roles.findIndex(role => role.id === updatedRole.id);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        if (state.currentRole?.id === updatedRole.id) {
          state.currentRole = updatedRole;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update role';
      })
      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter(role => role.id !== action.payload.id);
        state.total -= 1;
        if (state.currentRole?.id === action.payload.id) {
          state.currentRole = null;
        }
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete role';
      })
      // Fetch permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload.permissions || action.payload.data || action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch permissions';
      })
      // Update role permissions
      .addCase(updateRolePermissions.fulfilled, (state, action) => {
        const updatedRole = action.payload;
        const index = state.roles.findIndex(role => role.id === updatedRole.id);
        if (index !== -1) {
          state.roles[index] = updatedRole;
        }
        if (state.currentRole?.id === updatedRole.id) {
          state.currentRole = updatedRole;
        }
      })
      // Manage role permission
      .addCase(manageRolePermission.fulfilled, (state, action) => {
        const { roleId, permissionId, action: operation } = action.payload;
        const roleIndex = state.roles.findIndex(role => role.id === roleId);
        
        if (roleIndex !== -1) {
          if (operation === 'add') {
            // Add permission to role
            const permission = state.permissions.find(p => p.id === permissionId);
            if (permission && !state.roles[roleIndex].permissions.some(p => p.id === permissionId)) {
              state.roles[roleIndex].permissions.push(permission);
            }
          } else if (operation === 'remove') {
            // Remove permission from role
            state.roles[roleIndex].permissions = state.roles[roleIndex].permissions.filter(
              p => p.id !== permissionId
            );
          }
        }
        
        if (state.currentRole?.id === roleId) {
          state.currentRole = state.roles[roleIndex];
        }
      });
  },
});

export const { clearRoles, setCurrentRole, clearCurrentRole, clearError } = roleSlice.actions;
export default roleSlice.reducer;