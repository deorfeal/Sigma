import type { ItemInfo } from '../interfaces/itemInfo';
import type { SelectedValues } from '../interfaces/selects';

// Synchronizes selected values with a store
export function syncSelectedValuesWithStore(el: SelectedValues, store: any) {
    Object.entries(el).forEach(([key, value]) => {
        store.setSelectValue(key, value);
    });
}

// Refreshes item indexes and updates their visibility
export function refreshItemIndexes(items: Array<{ id: number; itemInfo: ItemInfo }>) {
    items.forEach((item, idx) => {
        // Set sequential IDs starting from 1
        item.id = idx + 1;
        // Update display number
        item.itemInfo.number = idx + 1;
    });
    // Update visibility after reindexing
    updateItemVisibility(items);
}

// Updates item visibility states
export function updateItemVisibility(items: Array<{ id: number; itemInfo: ItemInfo }>) {
    items.forEach((item, idx) => {
        // Only modify items that aren't the last one
        if (idx < items.length - 1) {
            item.itemInfo.hasAdd = false; // Disable add button
            item.itemInfo.disabled = true; // Disable interaction
        }
    });
}