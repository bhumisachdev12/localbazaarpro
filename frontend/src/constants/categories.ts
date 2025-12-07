export const CATEGORIES = [
    { id: 'all', label: 'All', icon: '🏪' },
    { id: 'Electronics', label: 'Electronics', icon: '📱' },
    { id: 'Books', label: 'Books', icon: '📚' },
    { id: 'Furniture', label: 'Furniture', icon: '🪑' },
    { id: 'Clothing', label: 'Clothing', icon: '👕' },
    { id: 'Sports', label: 'Sports', icon: '⚽' },
    { id: 'Stationery', label: 'Stationery', icon: '✏️' },
    { id: 'Accessories', label: 'Accessories', icon: '👜' },
    { id: 'Other', label: 'Other', icon: '📦' },
];

export const CONDITIONS = [
    { id: 'New', label: 'New', description: 'Brand new, unused' },
    { id: 'Like New', label: 'Like New', description: 'Barely used, excellent condition' },
    { id: 'Good', label: 'Good', description: 'Used but well maintained' },
    { id: 'Fair', label: 'Fair', description: 'Shows signs of wear' },
];

export const CAMPUSES = [
    'Main Campus',
    'North Campus',
    'South Campus',
    'East Campus',
    'West Campus',
];

export const SORT_OPTIONS = [
    { id: 'createdAt', label: 'Latest', order: 'desc' },
    { id: 'createdAt', label: 'Oldest', order: 'asc' },
    { id: 'price', label: 'Price: Low to High', order: 'asc' },
    { id: 'price', label: 'Price: High to Low', order: 'desc' },
    { id: 'views', label: 'Most Viewed', order: 'desc' },
];

export const REPORT_REASONS = [
    'Spam',
    'Inappropriate Content',
    'Misleading Information',
    'Scam/Fraud',
    'Duplicate Listing',
    'Sold Item Still Listed',
    'Other',
];

export const ORDER_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

export const PRODUCT_STATUS = {
    AVAILABLE: 'available',
    SOLD: 'sold',
    RESERVED: 'reserved',
    DELETED: 'deleted',
};
