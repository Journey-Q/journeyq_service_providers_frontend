const TourPackageReviewService = {
    BASE_URL: 'https://serviceprovidersservice-production-8f10.up.railway.app/service/tour-package-reviews',

    getAuthHeaders() {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('No access token found. Please login again.');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };
    },

    async handleResponse(response) {
        if (!response.ok) {
            let errorMessage = 'An error occurred';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
            } catch (e) {
                errorMessage = `HTTP ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    },

    async createProfile(profileData) {
        try {
            const response = await fetch(`${this.BASE_URL}/create`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(profileData)
            });

            const responseData = await this.handleResponse(response);
            localStorage.setItem('tour_guide_profile', JSON.stringify(responseData));
            console.log('Tour guide profile created successfully:', responseData);
            
            return responseData;
        } catch (error) {
            console.error('Error creating tour guide profile:', error);
            throw error;
        }
    },

    // Get all reviews for a tour package
    async getReviewsByTourPackageId(tourId) {
        try {
            const response = await fetch(`${this.BASE_URL}/tour/${tourId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching reviews for tour package:', error);
            throw error;
        }
    },

    // Get review statistics for a tour package
    async getReviewStatsByTourPackageId(tourId) {
        try {
            const response = await fetch(`${this.BASE_URL}/tour/${tourId}/stats`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching review stats for tour package:', error);
            throw error;
        }
    },

    // Calculate average rating from reviews
    async getAverageRating(tourId) {
        try {
            const reviews = await this.getReviewsByTourPackageId(tourId);
            
            if (!reviews || reviews.length === 0) {
                return 0; // No reviews yet
            }

            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            
            // Round to 1 decimal place
            return Math.round(averageRating * 10) / 10;
        } catch (error) {
            console.error('Error calculating average rating:', error);
            return 0; // Return 0 if there's an error
        }
    },

    // NEW: Get all reviews for all tours by service provider
    async getReviewsByServiceProviderId(serviceProviderId) {
        try {
            // First, get all tours for this service provider
            const TourPackageService = (await import('./TourPackageService')).default;
            const tours = await TourPackageService.getTourPackagesByServiceProviderId(serviceProviderId);
            
            if (!tours || tours.length === 0) {
                return []; // No tours, so no reviews
            }

            // Get reviews for each tour
            const reviewPromises = tours.map(async (tour) => {
                try {
                    const reviews = await this.getReviewsByTourPackageId(tour.id);
                    // Add tour information to each review
                    return reviews.map(review => ({
                        ...review,
                        tourName: tour.name,
                        tourId: tour.id
                    }));
                } catch (error) {
                    console.error(`Error fetching reviews for tour ${tour.id}:`, error);
                    return []; // Return empty array if error fetching reviews for a tour
                }
            });

            const reviewsArrays = await Promise.all(reviewPromises);
            
            // Flatten all reviews into a single array
            const allReviews = reviewsArrays.flat();
            
            console.log(`Found ${allReviews.length} reviews across ${tours.length} tours`);
            return allReviews;
            
        } catch (error) {
            console.error('Error fetching reviews by service provider:', error);
            throw error;
        }
    }
};

export default TourPackageReviewService;