const { FilterStrategyFactory } = require('../strategies/filter.strategy');
const Movie = require('../models/Movie');
const Show = require('../models/Show');

class MovieQueryBuilder {
  constructor(includeInactive = true) {
   
    this.movieQuery = includeInactive ? {} : { isActive: true };
    this.showQuery = includeInactive ? {} : { isActive: true };
    this.searchTerm = null;
    this.sortBy = 'releaseDate';
    this.sortOrder = -1; // -1 for descending, 1 for ascending
    this.page = 1;
    this.limit = 10;
    this.populateOptions = [];
    this.includeInactive = includeInactive;
  }


  search(term) {
    if (term) {
      this.searchTerm = term;
    }
    return this;
  }


  filter(filterType, value) {
    const strategy = FilterStrategyFactory.getStrategy(filterType);
    if (strategy) {
      if (filterType === 'showtime' || filterType === 'hall') {
        const result = strategy.apply(this.movieQuery, value, this.showQuery);
        this.movieQuery = result.movieQuery;
        this.showQuery = result.showQuery;
      } else {
        this.movieQuery = strategy.apply(this.movieQuery, value);
      }
    }
    return this;
  }

    filters(filters) {
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        this.filter(key, filters[key]);
      }
    });
    return this;
  }


  sort(field, order = 'desc') {
    this.sortBy = field;
    this.sortOrder = order === 'asc' ? 1 : -1;
    return this;
  }


  paginate(page = 1, limit = 10) {
    this.page = Math.max(1, parseInt(page));
    this.limit = Math.max(1, Math.min(100, parseInt(limit))); 
    return this;
  }

 
  populate(fields) {
    if (Array.isArray(fields)) {
      this.populateOptions = fields;
    } else {
      this.populateOptions.push(fields);
    }
    return this;
  }


  async build() {
    let query = Movie.find(this.movieQuery);

   
    if (this.searchTerm) {
      query = query.find({
        $or: [
          { title: { $regex: this.searchTerm, $options: 'i' } },
          { description: { $regex: this.searchTerm, $options: 'i' } }
        ]
      });
    }

   
    if (Object.keys(this.showQuery).length > 1) { 
      const shows = await Show.find(this.showQuery).distinct('movieId');
      query = query.find({ _id: { $in: shows } });
    }

 
    query = query.sort({ [this.sortBy]: this.sortOrder });

    const skip = (this.page - 1) * this.limit;
    query = query.skip(skip).limit(this.limit);

     this.populateOptions.forEach(option => {
      query = query.populate(option);
    });

    const movies = await query.exec();

    let countQuery = Movie.find(this.movieQuery);
    if (this.searchTerm) {
      countQuery = countQuery.find({
        $or: [
          { title: { $regex: this.searchTerm, $options: 'i' } },
          { description: { $regex: this.searchTerm, $options: 'i' } }
        ]
      });
    }
    if (Object.keys(this.showQuery).length > 1) {
      const shows = await Show.find(this.showQuery).distinct('movieId');
      countQuery = countQuery.find({ _id: { $in: shows } });
    }
    const total = await countQuery.countDocuments();

    return {
      movies,
      pagination: {
        page: this.page,
        limit: this.limit,
        total,
        totalPages: Math.ceil(total / this.limit),
        hasNext: this.page * this.limit < total,
        hasPrev: this.page > 1
      }
    };
  }

  
  async buildWithShows() {
    const result = await this.build();
    
    
    const moviesWithShows = await Promise.all(
      result.movies.map(async (movie) => {
        let showQuery = { movieId: movie._id };
        if (!this.includeInactive) {
          showQuery.isActive = true;
        }
        
        
        if (this.showQuery.startTime) {
          showQuery.startTime = this.showQuery.startTime;
        }
        if (this.showQuery.hallId) {
          showQuery.hallId = this.showQuery.hallId;
        }

        const shows = await Show.find(showQuery)
          .populate('hallId', 'name')
          .sort({ startTime: 1 });

        return {
          ...movie.toObject(),
          shows
        };
      })
    );

    return {
      movies: moviesWithShows,
      pagination: result.pagination
    };
  }

  
  includeInactive(include = true) {
    this.includeInactive = include;
    if (!include) {
      
      if (!this.movieQuery.hasOwnProperty('isActive')) {
        this.movieQuery.isActive = true;
      }
      if (!this.showQuery.hasOwnProperty('isActive')) {
        this.showQuery.isActive = true;
      }
    } else {
      
      delete this.movieQuery.isActive;
      delete this.showQuery.isActive;
    }
    return this;
  }

  
  reset() {
    
    this.movieQuery = this.includeInactive ? {} : { isActive: true };
    this.showQuery = this.includeInactive ? {} : { isActive: true };
    this.searchTerm = null;
    this.sortBy = 'releaseDate';
    this.sortOrder = -1;
    this.page = 1;
    this.limit = 10;
    this.populateOptions = [];
    return this;
  }
}

module.exports = MovieQueryBuilder;


