import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaCcVisa, FaCcMastercard, FaMobileAlt } from 'react-icons/fa';
import './summary.scss';

const Summary = () => {
    const { summaryItems, removeFromSummary, updateCartItem, calculateTotal, clearCart, isLoading } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [mpesaNumber, setMpesaNumber] = useState('');
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: ''
    });
    const [paymentError, setPaymentError] = useState('');
    const [editingItemId, setEditingItemId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const totalUSD = calculateTotal();
    const conversionRate = 130;
    const totalKSH = totalUSD * conversionRate;

    const handleCardChange = (field, value) => {
        setCardDetails({
            ...cardDetails,
            [field]: value
        });
    };

    const handleEditClick = (item) => {
        setEditingItemId(item.id);
        setEditFormData({
            firstName: item.firstName || '',
            lastName: item.lastName || '',
            email: item.email || '',
            phone: item.phone || '',
            travelDate: item.travelDate || '',
            returnDate: item.returnDate || '',
            adults: item.adults || 1,
            children: item.children || 0,
            specialRequests: item.specialRequests || ''
        });
    };

    const handleEditChange = (field, value) => {
        setEditFormData({
            ...editFormData,
            [field]: value
        });
    };

    const handleSaveEdit = (itemId) => {
        updateCartItem(itemId, editFormData);
        setEditingItemId(null);
    };

    const handleCancelEdit = () => {
        setEditingItemId(null);
        setEditFormData({});
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setPaymentError('');

        if (paymentMethod === 'mpesa' && !mpesaNumber) {
            setPaymentError('Please enter your M-Pesa number');
            return;
        }

        if (paymentMethod === 'card' && (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)) {
            setPaymentError('Please complete all card details');
            return;
        }

        try {
            // Placeholder for payment processing
            alert(`Payment of ${paymentMethod === 'mpesa' ? `${totalKSH.toFixed(2)} KSH` : `$${totalUSD.toFixed(2)}`} via ${paymentMethod} processed successfully!`);
            clearCart();
            // Clear form details
            if (paymentMethod === 'mpesa') {
                setMpesaNumber('');
            } else {
                setCardDetails({
                    cardNumber: '',
                    expiry: '',
                    cvv: '',
                    name: ''
                });
            }
        } catch (error) {
            setPaymentError('Payment failed. Please try again.');
            console.error('Payment error:', error);
        }
    };

    return (
        <section className="summary container section">
            <div className="secTitle">
                <h3 className="title">Booking Summary</h3>
                <p className="subtitle">Review and confirm your holiday plans</p>
                {paymentError && <div className="error-message">{paymentError}</div>}
            </div>

            {summaryItems.length === 0 ? (
                <div className="emptySummary">
                    <p>Your booking summary is empty. Start planning your adventure now!</p>
                    <div className="emptySummaryActions">
                        <a href="/kenyan-holidays" className="btn">Discover Kenyan Holidays</a>
                        <a href="/international-holidays" className="btn">Explore International Holidays</a>
                    </div>
                </div>
            ) : (
                <div className="summaryContent">
                    <div className="bookingsList">
                        {summaryItems.map(item => (
                            <div key={item.id} className="bookingItem">
                                <div className="itemImage">
                                    <img src={item.image_url} alt={item.title} />
                                </div>
                                
                                <div className="itemDetails">
                                    <h4>{item.title}</h4>
                                    <span className="location flex">
                                        <HiOutlineLocationMarker className="icon" />
                                        <span>{item.location}</span>
                                    </span>
                                    
                                    <p className="price">${item.fees}</p>
                                    <p className="description">{item.description}</p>
                                    
                                    {editingItemId === item.id ? (
                                        <div className="editForm">
                                            <div className="formRow">
                                                <div className="formGroup">
                                                    <label>First Name *</label>
                                                    <input 
                                                        type="text" 
                                                        value={editFormData.firstName}
                                                        onChange={(e) => handleEditChange('firstName', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="formGroup">
                                                    <label>Last Name *</label>
                                                    <input 
                                                        type="text" 
                                                        value={editFormData.lastName}
                                                        onChange={(e) => handleEditChange('lastName', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="formRow">
                                                <div className="formGroup">
                                                    <label>Email *</label>
                                                    <input 
                                                        type="email" 
                                                        value={editFormData.email}
                                                        onChange={(e) => handleEditChange('email', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="formGroup">
                                                    <label>Phone (with country code)</label>
                                                    <input 
                                                        type="tel" 
                                                        value={editFormData.phone}
                                                        onChange={(e) => handleEditChange('phone', e.target.value)}
                                                        placeholder="e.g., +254712345678"
                                                    />
                                                </div>
                                            </div>
                                            <div className="formRow">
                                                <div className="formGroup">
                                                    <label>Travel Date *</label>
                                                    <input 
                                                        type="date" 
                                                        value={editFormData.travelDate}
                                                        onChange={(e) => handleEditChange('travelDate', e.target.value)}
                                                        required
                                                        min={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                                <div className="formGroup">
                                                    <label>Return Date (optional)</label>
                                                    <input 
                                                        type="date" 
                                                        value={editFormData.returnDate}
                                                        onChange={(e) => handleEditChange('returnDate', e.target.value)}
                                                        min={editFormData.travelDate || new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="formRow">
                                                <div className="formGroup">
                                                    <label>Number of Adults *</label>
                                                    <input 
                                                        type="number" 
                                                        min="1"
                                                        value={editFormData.adults}
                                                        onChange={(e) => handleEditChange('adults', parseInt(e.target.value))}
                                                        required
                                                    />
                                                </div>
                                                <div className="formGroup">
                                                    <label>Number of Children</label>
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        value={editFormData.children}
                                                        onChange={(e) => handleEditChange('children', parseInt(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="formGroup">
                                                <label>Special Requests</label>
                                                <textarea 
                                                    value={editFormData.specialRequests}
                                                    onChange={(e) => handleEditChange('specialRequests', e.target.value)}
                                                    placeholder="Any special requirements or notes"
                                                />
                                            </div>
                                            <div className="formActions">
                                                <button 
                                                    className="saveBtn"
                                                    onClick={() => handleSaveEdit(item.id)}
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    className="cancelBtn"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bookingInfo">
                                            <p><strong>Name:</strong> {item.firstName} {item.lastName}</p>
                                            <p><strong>Email:</strong> {item.email}</p>
                                            {item.phone && <p><strong>Phone:</strong> {item.phone}</p>}
                                            <p><strong>Travel Date:</strong> {item.travelDate}</p>
                                            {item.returnDate && <p><strong>Return Date:</strong> {item.returnDate}</p>}
                                            <p>
                                                <strong>People:</strong> {item.adults} adult{item.adults > 1 ? 's' : ''} 
                                                {item.children > 0 ? `, ${item.children} child${item.children > 1 ? 'ren' : ''}` : ''}
                                            </p>
                                            {item.specialRequests && <p><strong>Special Requests:</strong> {item.specialRequests}</p>}
                                            <div className="itemActions">
                                                <button 
                                                    className="editBtn"
                                                    onClick={() => handleEditClick(item)}
                                                    disabled={isLoading}
                                                >
                                                    <AiFillEdit className="icon" /> Edit Details
                                                </button>
                                                <button 
                                                    className="removeBtn"
                                                    onClick={() => removeFromSummary(item.id)}
                                                    disabled={isLoading}
                                                >
                                                    <AiFillDelete className="icon" /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="totalAmount">
                        <h4>Total Amount</h4>
                        <div className="amountDetails">
                            <p>
                                <strong>Total in USD:</strong> ${totalUSD.toFixed(2)}
                            </p>
                            {paymentMethod === 'mpesa' && (
                                <p>
                                    <strong>Total in KSH:</strong> {totalKSH.toFixed(2)} KSH
                                    <span className="conversionNote"> (1 USD = 130 KSH)</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="paymentSection">
                        <div className="summaryCard">
                            <h4>Payment Details</h4>
                            
                            <form className="paymentForm" onSubmit={handlePayment}>
                                <div className="paymentOptions">
                                    <label className={`paymentOption ${paymentMethod === 'mpesa' ? 'active' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="mpesa" 
                                            checked={paymentMethod === 'mpesa'}
                                            onChange={() => setPaymentMethod('mpesa')}
                                        />
                                        <span>
                                            <FaMobileAlt className="paymentIcon" /> Pay via M-Pesa
                                        </span>
                                    </label>
                                    
                                    <label className={`paymentOption ${paymentMethod === 'card' ? 'active' : ''}`}>
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            value="card" 
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                        />
                                        <span>
                                            <FaCcVisa className="paymentIcon" /> 
                                            <FaCcMastercard className="paymentIcon" /> 
                                            Credit/Debit Card
                                        </span>
                                    </label>
                                </div>
                                
                                {paymentMethod === 'mpesa' && (
                                    <div className="mpesaDetails">
                                        <div className="formGroup">
                                            <label>M-Pesa Phone Number (e.g., +254712345678)</label>
                                            <div className="inputWithIcon">
                                                <FaMobileAlt className="inputIcon" />
                                                <input 
                                                    type="tel" 
                                                    placeholder="+254712345678"
                                                    pattern="\+?[0-9]{10,12}"
                                                    value={mpesaNumber}
                                                    onChange={(e) => setMpesaNumber(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <p className="note">
                                            You will receive a payment request on your phone. Enter your M-Pesa PIN to complete the transaction.
                                        </p>
                                    </div>
                                )}
                                
                                {paymentMethod === 'card' && (
                                    <div className="cardDetails">
                                        <div className="formGroup">
                                            <label>Card Number</label>
                                            <div className="inputWithIcon">
                                                <FaCcVisa className="inputIcon" />
                                                <FaCcMastercard className="inputIcon" />
                                                <input 
                                                    type="text" 
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardDetails.cardNumber}
                                                    onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="formRow">
                                            <div className="formGroup">
                                                <label>Expiry Date</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="MM/YY"
                                                    value={cardDetails.expiry}
                                                    onChange={(e) => handleCardChange('expiry', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="formGroup">
                                                <label>CVV</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="123"
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => handleCardChange('cvv', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="formGroup">
                                            <label>Name on Card</label>
                                            <input 
                                                type="text" 
                                                placeholder="John Doe"
                                                value={cardDetails.name}
                                                onChange={(e) => handleCardChange('name', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <button 
                                    type="submit" 
                                    className="btn payBtn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Processing...' : `Pay ${paymentMethod === 'mpesa' ? `${totalKSH.toFixed(2)} KSH` : `$${totalUSD.toFixed(2)}`}`}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Summary;