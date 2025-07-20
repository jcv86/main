interface SyncItem {
  id: string
  type: string
  data: any
  timestamp: number
  synced: boolean
}

interface SyncStatus {
  isOnline: boolean
  lastSync: Date | null
  pendingItems: number
  syncInProgress: boolean
  error: string | null
}

class SyncService {
  private syncQueue: SyncItem[] = []
  private status: SyncStatus = {
    isOnline: navigator.onLine,
    lastSync: null,
    pendingItems: 0,
    syncInProgress: false,
    error: null,
  }
  private listeners: ((status: SyncStatus) => void)[] = []
  private activityTimeout: NodeJS.Timeout | null = null

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", this.handleOnline.bind(this))
      window.addEventListener("offline", this.handleOffline.bind(this))

      // Load pending items from localStorage
      this.loadPendingItems()

      // Try to sync on startup if online
      if (this.status.isOnline) {
        this.syncWhenOnline()
      }
    }
  }

  private handleOnline() {
    this.status.isOnline = true
    this.status.error = null
    this.notifyListeners()
    this.syncWhenOnline()
  }

  private handleOffline() {
    this.status.isOnline = false
    this.notifyListeners()
  }

  private loadPendingItems() {
    try {
      const stored = localStorage.getItem("syncQueue")
      if (stored) {
        this.syncQueue = JSON.parse(stored)
        this.status.pendingItems = this.syncQueue.filter((item) => !item.synced).length
      }
    } catch (error) {
      console.error("Error loading sync queue:", error)
    }
  }

  private savePendingItems() {
    try {
      localStorage.setItem("syncQueue", JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error("Error saving sync queue:", error)
    }
  }

  addToQueue(type: string, data: any): string {
    const item: SyncItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      data,
      timestamp: Date.now(),
      synced: false,
    }

    this.syncQueue.push(item)
    this.status.pendingItems = this.syncQueue.filter((item) => !item.synced).length
    this.savePendingItems()
    this.notifyListeners()

    if (this.status.isOnline) {
      this.syncWhenOnline()
    }

    return item.id
  }

  async syncWhenOnline(): Promise<void> {
    if (!this.status.isOnline || this.status.syncInProgress) {
      return
    }

    this.status.syncInProgress = true
    this.status.error = null
    this.notifyListeners()

    try {
      const unsyncedItems = this.syncQueue.filter((item) => !item.synced)

      for (const item of unsyncedItems) {
        await this.syncItem(item)
        item.synced = true
      }

      this.status.lastSync = new Date()
      this.status.pendingItems = 0
      this.savePendingItems()
    } catch (error) {
      this.status.error = error instanceof Error ? error.message : "Sync failed"
      console.error("Sync error:", error)
    } finally {
      this.status.syncInProgress = false
      this.notifyListeners()
    }
  }

  private async syncItem(item: SyncItem): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100))

    // In a real app, you would make actual API calls here
    console.log(`Syncing ${item.type}:`, item.data)
  }

  getStatus(): SyncStatus {
    return { ...this.status }
  }

  onStatusChange(callback: (status: SyncStatus) => void): () => void {
    this.listeners.push(callback)
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback(this.getStatus()))
  }

  simulateActivity() {
    // Clear existing timeout
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout)
    }

    // Add a mock activity to the queue
    this.addToQueue("user_activity", {
      action: "dashboard_view",
      timestamp: Date.now(),
    })

    // Set timeout to simulate more activity
    this.activityTimeout = setTimeout(() => {
      this.addToQueue("user_activity", {
        action: "chart_interaction",
        timestamp: Date.now(),
      })
    }, 2000)
  }

  clearQueue() {
    this.syncQueue = []
    this.status.pendingItems = 0
    this.savePendingItems()
    this.notifyListeners()
  }
}

export const syncService = new SyncService()
