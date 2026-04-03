import { useState, useRef, useEffect } from "react";
import Icon from "./Icon";
import { useData } from "../context/DataContext";
import { useNavigate } from "react-router-dom";
import CarCard from "./CarCard";

const AIChatBot = () => {
  const { cars } = useData();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I am your Motriva AI assistant. Are you looking to buy or sell a car?" }
  ]);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState(null);
  const [preferences, setPreferences] = useState({ category: "", budget: "" });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (!isTyping && inputRef.current) {
       inputRef.current.focus();
    }
  }, [messages, isTyping]);

  const simulateAI = (text, delay = 1000, callback, results = undefined) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: "ai", text, results }]);
      setIsTyping(false);
      if (callback) callback();
    }, delay);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInputText("");

    const lowerStr = userMsg.toLowerCase();
    
    // 1. Dual-mode routing check for "buy" or "sell" at Start
    if (step === 1) {
      if (lowerStr.includes("buy")) {
        setMode("buy");
        setStep(2);
        simulateAI("Great! What are you looking for? (e.g. Brand, Model, Year, KM driven)");
        return;
      } else if (lowerStr.includes("sell")) {
        setMode("sell");
        setStep(2);
        simulateAI("Let's get your car listed! What are you looking to sell? (Please include Brand, Model, Year, and KM driven)");
        return;
      }
    }

    // 2. Direct Broad Search (Only when starting or implicitly requested)
    if (step === 1 && mode !== "sell") {
       // Search logic mapping
       const directMatches = cars.filter(c => 
         (c.make && lowerStr.includes(c.make.toLowerCase())) || 
         (c.model && lowerStr.includes(c.model.toLowerCase())) || 
         (c.bodyType && lowerStr.includes(c.bodyType.toLowerCase())) || 
         (lowerStr.includes(c.fuel.toLowerCase()))
       );

       if (directMatches.length > 0 && lowerStr.length > 2) {
         setMode("buy");
         setStep(4);
         simulateAI(`I found some best matches for your search:`, 1000, null, directMatches.slice(0, 3));
         return;
       }
    }

    // 3. Step logic handling
    if (mode === "buy") {
      if (step === 2) {
         setPreferences(prev => ({ ...prev, category: userMsg }));
         setStep(3);
         simulateAI(`Got it. Lastly, what is your budget? (You can type your desired amount)`);
      } else if (step === 3) {
         let budgetVal = parseInt(userMsg.replace(/[^0-9]/g, ''));
         if (isNaN(budgetVal)) {
           // Not a number, maybe they just typed cars directly
           const fallbackMatches = cars.filter(c => 
             `${c.make} ${c.model}`.toLowerCase().includes(lowerStr)
           );
           if (fallbackMatches.length > 0) {
             simulateAI(`I couldn't detect a budget, but I found these specific matches:`, 1000, null, fallbackMatches.slice(0, 3));
           } else {
             simulateAI("I couldn't understand that response. Let's restart the Main Menu. Please tell me if you're looking to 'Buy' or 'Sell'.");
             setTimeout(() => resetChat(), 1500);
           }
           return;
         }
         
         setPreferences(prev => ({ ...prev, budget: userMsg }));
         setStep(4);
         simulateAI("Analyzing Motriva inventory...", 1000, () => calculateResults({ ...preferences, budget: userMsg }));
      } else {
         simulateAI("I'm here to help! You can type a brand, model, or click the refresh icon to restart.");
      }
    } else if (mode === "sell") {
      if (step === 2) {
         // Check if they provided enough info: need at least 2 words or numbers
         const hasNumbers = /[0-9]{2,}/.test(lowerStr);
         if (!hasNumbers) {
           simulateAI("I couldn't get that car detail. Please provide the Model, Year and KM driven properly to analyze the market trend, or click refresh to restart.");
           return;
         }
         setStep(4);
         simulateAI(`Analyzing market data for "${userMsg}"...`, 1500, () => {
            const min = Math.floor(Math.random() * 5) + 5; 
            const max = min + 3;
            // Mentioning lacks automatically
            simulateAI(`Based on current market analysis, the best match trend for your listing is roughly ₹${min} to ₹${max} Lakhs. Please contact our support team or use the Sell page to finalize your listing!`);
         });
      } else {
         simulateAI("If you have another car to sell, click the refresh icon to restart!");
      }
    } else {
       // Step 1 Fallback/Fallback for unrecognized string
       simulateAI("I didn't quite get that. Please tell me if you want to 'Buy' or 'Sell', or you can just type a car Brand, Model, Year, or KM preference to begin!");
    }
  };

  const calculateResults = (prefs) => {
    let budgetVal = parseInt(prefs.budget.replace(/[^0-9]/g, ''));
    if (budgetVal < 1000) budgetVal = budgetVal * 100000; 
    if (!budgetVal) budgetVal = 50000000;

    const catQuery = prefs.category.toLowerCase();

    let matches = cars.filter(c => {
      const rawCarStr = `${c.make} ${c.model} ${c.bodyType} ${c.year} ${c.fuel}`.toLowerCase();
      const matchQuery = catQuery.split(' ').some(w => w.length > 2 && rawCarStr.includes(w));
      const matchBudget = (c.priceRaw || 0) <= budgetVal;
      return matchQuery && matchBudget;
    });

    if (matches.length === 0) {
      // Just filter budget
      matches = cars.filter(c => (c.priceRaw || 0) <= budgetVal);
    }

    if (matches.length > 0) {
       simulateAI(`Here are the best matches according to your preferences:`, 1000, null, matches.slice(0, 3));
    } else {
       simulateAI(`I couldn't find any exact match. Please try searching another brand or model!`);
    }
  };

  const resetChat = () => {
    setStep(1);
    setMode(null);
    setPreferences({ category: "", budget: "" });
    setMessages([
      { sender: "ai", text: "Hi! I am your Motriva AI assistant. Are you looking to buy or sell a car?" }
    ]);
  };

  return (
    <>
      <div className="fixed bottom-24 right-5 z-50 flex items-center gap-3">
        {!isOpen && (
          <div className="bg-surface-container-lowest font-headline font-bold text-xs text-on-surface px-3 py-1.5 rounded-full editorial-shadow-sm animate-fade-in relative hidden md:block">
            Chat with me
            <div className="absolute top-1/2 -right-1.5 transform -translate-y-1/2 rotate-45 w-3 h-3 bg-surface-container-lowest -z-10" />
          </div>
        )}
        <button 
          className="w-14 h-14 bg-tertiary text-on-tertiary rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform animate-bounce relative"
          onClick={() => setIsOpen(true)}
        >
          <Icon name="smart_toy" filled size={26} />
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-[110px] right-5 z-50 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-highest overflow-hidden flex flex-col h-[450px] animate-fade-up">
          {/* Header */}
          <div className="bg-tertiary px-4 py-3 flex justify-between items-center text-on-tertiary">
            <div className="flex items-center gap-2">
              <Icon name="auto_awesome" filled size={18} />
              <span className="font-headline font-bold text-sm">Motriva AI</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={resetChat}><Icon name="refresh" size={18} /></button>
              <button onClick={() => setIsOpen(false)}><Icon name="close" size={20} /></button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm font-body ${msg.sender === "user" ? "bg-primary text-on-primary rounded-tr-sm" : "bg-surface-container-high text-on-surface rounded-tl-sm"}`}>
                  {msg.text}
                </div>
                {msg.results && msg.results.length > 0 && (
                  <div className="mt-3 w-[260px] space-y-3">
                    {msg.results.map(car => (
                      <div key={car.id} className="zoom-[0.8] origin-top-left" style={{ transform: "scale(0.8)", width: "125%" }}>
                        <CarCard car={car} />
                      </div>
                    ))}
                    <button 
                      onClick={() => navigate('/search')}
                      className="text-tertiary font-bold text-xs mt-2 w-full text-center"
                    >
                      View all exactly listed
                    </button>
                  </div>
                )}
                {msg.results && msg.results.length === 0 && (
                  <div className="mt-2 text-xs text-on-surface-variant font-bold">
                    No exact matches found right now.
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="bg-surface-container-high w-16 px-4 py-3 rounded-2xl rounded-tl-sm flex justify-center gap-1">
                <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 bg-surface border-t border-outline-variant/20 flex gap-2">
            <input 
              ref={inputRef}
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your answer..."
              disabled={isTyping}
              autoFocus
              className="flex-1 bg-surface-container-highest px-4 py-2 rounded-full text-sm font-body outline-none focus:ring-2 focus:ring-tertiary/50"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || !inputText.trim()}
              className="w-10 h-10 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center disabled:opacity-50"
            >
              <Icon name="send" size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
