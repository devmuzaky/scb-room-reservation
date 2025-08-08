import { Component } from '@angular/core';

@Component({
  template: `
    <div class="space-y-6">
      <div class="flex items-center space-x-3">
        <div
          class="h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center"
        >
          <i class="pi pi-users text-white text-xl"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manage People</h1>
          <p class="text-gray-600">Add and manage staff user accounts</p>
        </div>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <i class="pi pi-info-circle text-blue-600 text-lg"></i>
          <div>
            <h3 class="font-semibold text-blue-900">Coming Soon!</h3>
            <p class="text-blue-700 text-sm">
              This page is ready for your interns to build the user management
              features.
            </p>
          </div>
        </div>
        <div class="mt-4 space-y-2 text-sm text-blue-700">
          <div class="flex items-center space-x-2">
            <i class="pi pi-check-circle text-blue-600"></i>
            <span>Add new staff users by email</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="pi pi-check-circle text-blue-600"></i>
            <span>View user status (Activated/Not Activated)</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="pi pi-check-circle text-blue-600"></i>
            <span>Delete users and manage access</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ManagePeopleComponent {}
