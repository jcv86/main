import { syncService } from "./sync-service"

export interface OfflineData {
  id: string
  table: string
  data: any
  timestamp: number
  synced: boolean
}

class OfflineStorage {
  private isClient = typeof window !== "undefined"

  private getStorageKey(table: string, userId: string): string {
    return `offline-${table}-${userId}`
  }

  public async saveData(
    table: string,
    data: any,
    userId: string,
    action: "insert" | "update" = "insert",
  ): Promise<void> {
    if (!this.isClient) {
      console.warn("OfflineStorage: Cannot save data on server side")
      return
    }

    try {
      // Save to local storage
      const storageKey = this.getStorageKey(table, userId)
      const existing = this.getData(table, userId)

      const offlineItem: OfflineData = {
        id: data.id || crypto.randomUUID(),
        table,
        data: { ...data, user_id: userId },
        timestamp: Date.now(),
        synced: false,
      }

      const updated = [...existing.filter((item) => item.id !== offlineItem.id), offlineItem]
      localStorage.setItem(storageKey, JSON.stringify(updated))

      // Add to sync queue
      syncService.addToSyncQueue({
        table,
        action,
        data: offlineItem.data,
        userId,
      })

      console.log(`Saved ${table} data offline:`, offlineItem.id)
    } catch (error) {
      console.error("Error saving offline data:", error)
      throw error
    }
  }

  public getData(table: string, userId: string): OfflineData[] {
    if (!this.isClient) {
      return []
    }

    try {
      const storageKey = this.getStorageKey(table, userId)
      const stored = localStorage.getItem(storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading offline data:", error)
      return []
    }
  }

  public getDataById(table: string, userId: string, id: string): OfflineData | null {
    const data = this.getData(table, userId)
    return data.find((item) => item.id === id) || null
  }

  public deleteData(table: string, userId: string, id: string): void {
    if (!this.isClient) {
      console.warn("OfflineStorage: Cannot delete data on server side")
      return
    }

    try {
      const storageKey = this.getStorageKey(table, userId)
      const existing = this.getData(table, userId)
      const updated = existing.filter((item) => item.id !== id)
      localStorage.setItem(storageKey, JSON.stringify(updated))

      // Add delete action to sync queue
      syncService.addToSyncQueue({
        table,
        action: "delete",
        data: { id },
        userId,
      })

      console.log(`Deleted ${table} data offline:`, id)
    } catch (error) {
      console.error("Error deleting offline data:", error)
      throw error
    }
  }

  public clearTable(table: string, userId: string): void {
    if (!this.isClient) {
      console.warn("OfflineStorage: Cannot clear table on server side")
      return
    }

    try {
      const storageKey = this.getStorageKey(table, userId)
      localStorage.removeItem(storageKey)
      console.log(`Cleared ${table} offline data`)
    } catch (error) {
      console.error("Error clearing offline data:", error)
    }
  }

  public getAllTables(userId: string): string[] {
    if (!this.isClient) {
      return []
    }

    const tables: string[] = []
    const prefix = `offline-`
    const suffix = `-${userId}`

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(prefix) && key.endsWith(suffix)) {
          const table = key.slice(prefix.length, -suffix.length)
          tables.push(table)
        }
      }
    } catch (error) {
      console.error("Error getting all tables:", error)
    }

    return tables
  }

  public getStorageStats(userId: string): { table: string; count: number; size: number }[] {
    if (!this.isClient) {
      return []
    }

    const tables = this.getAllTables(userId)
    return tables.map((table) => {
      const data = this.getData(table, userId)
      const size = new Blob([JSON.stringify(data)]).size
      return {
        table,
        count: data.length,
        size,
      }
    })
  }
}

export const offlineStorage = new OfflineStorage()
