import { Component } from '@angular/core';

@Component({
  template: `
    <div class="space-y-6">
      <div class="flex items-center space-x-3">
        <div
          class="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center"
        >
          <i class="pi pi-home text-white text-xl"></i>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manage Rooms</h1>
          <p class="text-gray-600">
            View room availability and manage bookings
          </p>
        </div>
      </div>

      <div class="bg-green-50 border border-green-200 rounded-xl p-6">
        <div class="flex items-center space-x-3">
          <i class="pi pi-calendar text-green-600 text-lg"></i>
          <div>
            <h3 class="font-semibold text-green-900">Ready to Build!</h3>
            <p class="text-green-700 text-sm">
              Create the room management interface here.
            </p>
          </div>
        </div>
        <div class="mt-4 space-y-2 text-sm text-green-700">
          <div class="flex items-center space-x-2">
            <i class="pi pi-check-circle text-green-600"></i>
            <span>Date picker for viewing specific days</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="pi pi-check-circle text-green-600"></i>
            <span>Room availability grid view</span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="pi pi-check-circle text-green-600"></i>
            <span>Cancel bookings with confirmation</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ManageRoomsComponent {}
