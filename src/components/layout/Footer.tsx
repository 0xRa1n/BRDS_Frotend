export function Footer() {
  return (
    <footer className="bg-gray-50 py-12 mt-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Brgy. San Isidro, Quezon City</h4>
              <p className="text-sm text-gray-500">143 Mabini St., Brgy. San Isidro</p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Office Hours</h4>
              <p className="text-sm text-gray-500">Mon-Fri, 8:00 AM - 5:00 PM</p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Contact</h4>
              <p className="text-sm text-gray-500">0917-123-4567</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">About Us</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-gray-900">Emergency Hotlines</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
