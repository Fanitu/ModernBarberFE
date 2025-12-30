import React, { useState } from 'react';
import { bookingAPI }  from '../apiServece/apiService.jsx'
import { 
  Clock, 
  User, 
  Phone, 
  Scissors, 
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const BookingTable = ({ 
  bookings = [], 
  onStatusUpdate, 
  showActions = false,
  paginated = false 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const DeleteBooking = async (bookingId) =>{
    if(!bookingId)return;

   const res =  await bookingAPI.cancelBooking(bookingId,{status: 'cancelled'})
   console.log(res)
   alert(res.data.message);

  }

  // Helper functions that were missing
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'confirmed': return 'confirmed';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  // Pagination logic
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedBookings = paginated ? bookings.slice(startIndex, endIndex) : bookings;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (bookings.length === 0) {
    return (
      <div className="empty-table-state">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
        <p className="text-gray-600">There are no bookings to display.</p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h2>Bookings</h2>
        <p className="table-subtitle">
          Total: {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Amount</th>
              <th>Status</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {displayedBookings.map((booking) => (
              <tr key={booking._id} className="table-row">
                <td>
                  <div className="client-cell">
                    <div className="client-avatar">
                      {booking.client?.name?.charAt(0) || 'C'}
                    </div>
                    <div className="client-info">
                      <div className="client-name">{booking.client?.name || 'Client Name'}</div>
                      <div className="client-phone">
                        <Phone size={12} />
                        {booking.client?.phone || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="service-cell">
                    <Scissors size={16} />
                    <span className="service-name">{booking.service?.name || 'Service'}</span>
                    <div className="service-duration">{booking.service?.duration || 0} mins</div>
                  </div>
                </td>
                <td>
                  <div className="datetime-cell">
                    <Calendar size={16} />
                    <div>
                      <div className="date">{formatDate(booking.bookingDate || booking.bookingdate)}</div>
                      <div className="time">
                        <Clock size={12} />
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="amount-cell">
                    <DollarSign size={16} />
                    <span className="amount">${booking.totalAmount || 0}</span>
                    {booking.paymentStatus && (
                      <span className={`payment-status ${booking.paymentStatus}`}>
                        {booking.paymentStatus}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="status-text">
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                    </span>
                  </span>
                </td>
                {showActions && (
                  <td>
                    <div className="table-actions">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => onStatusUpdate(booking._id, 'confirmed')}
                          className="table-btn confirm"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => onStatusUpdate(booking._id, 'completed')}
                          className="table-btn complete"
                        >
                          Complete
                        </button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => DeleteBooking(booking._id)}
                          className="table-btn cancel"
                        >
                          Cancel
                        </button>
                      )}
                      <button className="table-btn view" title="View Details">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing <strong>{startIndex + 1}</strong> to{' '}
            <strong>{Math.min(endIndex, bookings.length)}</strong> of{' '}
            <strong>{bookings.length}</strong> bookings
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <div className="page-numbers">
              {getPageNumbers().map((pageNum, index) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${index}`} className="page-ellipsis">...</span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                )
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;