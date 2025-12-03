import { useState, useEffect } from 'react';
import { sendNewsToSubscribers, getAllSubscribers } from '../../api/subscriptionApi';
import Loader from '../../components/common/Loader';

const AdminSendNews = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [fetchingCount, setFetchingCount] = useState(true);

  useEffect(() => {
    fetchSubscriberCount();
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const data = await getAllSubscribers();
      setSubscriberCount(data.count || 0);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setFetchingCount(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus('');

    if (!subject.trim() || !message.trim()) {
      setStatus('error:Please fill in both subject and message');
      return;
    }

    setLoading(true);
    try {
      const result = await sendNewsToSubscribers(subject, message);
      setStatus(`success:${result.message || 'News/Offer sent successfully!'}`);
      setSubject('');
      setMessage('');
      setTimeout(() => setStatus(''), 5000);
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.message || 'Server error. Please check email configuration.';
      setStatus(`error:${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const isError = status.startsWith('error:');
  const statusMessage = status.split(':')[1] || status;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Send News & Offers
          </h1>
          <p className="text-gray-600">
            Send promotional emails to all subscribers
          </p>
          {fetchingCount ? (
            <p className="text-sm text-gray-500 mt-2">Loading subscriber count...</p>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Current subscribers: <span className="font-semibold text-gray-700">{subscriberCount}</span>
            </p>
          )}
        </div>

        {/* Email Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSend} className="space-y-6">
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Email Subject *
              </label>
              <input
                id="subject"
                type="text"
                placeholder="e.g., New Collection Launch - 30% Off!"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d5a437] focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Email Message (HTML supported) *
              </label>
              <textarea
                id="message"
                placeholder="Write your offer/news here. You can use HTML tags for formatting."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg h-64 focus:outline-none focus:ring-2 focus:ring-[#d5a437] focus:border-transparent resize-none"
                disabled={loading}
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: You can use HTML tags like {'<b>, <i>, <p>, <br>, <a>'} for formatting
              </p>
            </div>

            {/* Preview Section */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview:</h3>
              <div className="bg-white p-4 rounded border border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">{subject || 'Subject will appear here'}</p>
                <div 
                  className="text-gray-700 text-sm"
                  dangerouslySetInnerHTML={{ __html: message || 'Message content will appear here' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || subscriberCount === 0}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all duration-300 ${
                loading || subscriberCount === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-700 active:scale-95'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending to {subscriberCount} subscribers...
                </span>
              ) : subscriberCount === 0 ? (
                'No Subscribers Available'
              ) : (
                `Send to ${subscriberCount} Subscriber${subscriberCount !== 1 ? 's' : ''}`
              )}
            </button>

            {/* Status Message */}
            {status && (
              <div
                className={`p-4 rounded-lg text-sm font-medium ${
                  isError
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}
              >
                {statusMessage}
              </div>
            )}
          </form>
        </div>

        {/* HTML Template Examples */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Sample Email Templates
          </h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded p-3 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 mb-2">Simple Offer Template:</p>
              <code className="text-xs text-gray-700 block overflow-x-auto whitespace-pre">
{`<h2>🎉 Special Offer Just For You!</h2>
<p>Dear Valued Customer,</p>
<p>Get <b>30% OFF</b> on our new collection!</p>
<p>Use code: <b>NEW30</b> at checkout.</p>
<p>Valid until [Date]</p>
<a href="https://yourstore.com/products">Shop Now</a>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSendNews;
