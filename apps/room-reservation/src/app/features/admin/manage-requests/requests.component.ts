import { Component } from '@angular/core';

@Component({
  template: `
    <div class="space-y-6">
      <div class="flex items-center space-x-3">
        <div
          class="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center"
        >
          <i class="pi pi-inbox text-white text-xl"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manage Requests</h1>
          <p class="text-gray-600">Review and approve booking requests</p>
        </div>
      </div>

      <div class="bg-purple-50 border border-purple-200 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <i class="pi pi-list text-purple-600 text-lg"></i>
          <div>
            <h3 class="font-semibold text-purple-900">Approval System</h3>
            <p class="text-purple-700 text-sm">
              Build the request approval workflow here.
            </p>
          </div>
        </div>
        <div class="mt-4 space-y-2 text-sm text-purple-700">
          <div class="flex items-center space-x-2">
            <i class="pi pi-check-circle text-purple-600"></i>
            <span>List all pending booking requests</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="pi pi-check-circle text-purple-600"></i>
            <span>Show requester details and request info</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="pi pi-check-circle text-purple-600"></i>
            <span>Approve or reject with one click</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ManageRequestsComponent {}
