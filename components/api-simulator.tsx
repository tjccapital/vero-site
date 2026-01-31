"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// Types for API steps and logs
interface ApiLog {
  id: string;
  stepNumber: number;
  endpoint: string;
  method: string;
  timestamp: string;
  request: object | null;
  response: object;
  description: string;
  docUrl?: string;
}

// Documentation URLs for each API endpoint
const DOC_URLS: Record<number, string> = {
  1: "https://docs.seevero.com/api-reference/onboarding/generate-keys",
  2: "https://docs.seevero.com/api-reference/onboarding/register",
  3: "https://docs.seevero.com/api-reference/payments/create",
  4: "https://docs.seevero.com/api-reference/keys/grant-access",
  5: "https://docs.seevero.com/api-reference/payments/decrypt",
};

interface StepData {
  keyId?: string;
  publicKey?: string;
  privateKey?: string;
  algorithm?: string;
  // Step 2 - Register User
  hashedPan?: string;
  userId?: string;
  userStatus?: string;
  registeredAt?: string;
  // Step 3 - Create Payment
  receiptId?: string;
  transactionId?: string;
  merchantName?: string;
  subtotal?: number;
  taxAmount?: number;
  totalAmount?: number;
  currency?: string;
  items?: Array<{ name: string; quantity: number; unitPrice: number }>;
  paymentId?: string;
  gateway?: string;
  // Step 4 - Grant Decrypt Access
  tokenId?: string;
  tokenPurpose?: string;
  tokenGrantedAt?: string;
  tokenExpiresAt?: string;
  // Step 5 - Decrypt Receipt
  decryptedReceipt?: {
    receiptId: string;
    merchant: {
      name: string;
      address: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    };
    transaction: {
      id: string;
      date: string;
    };
    payment: {
      method: string;
      last4: string;
      brand: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
    summary: {
      currency: string;
      subtotal: number;
      tax: number;
      total: number;
    };
  };
}

// Mock API responses
const generateKeyPairResponse = {
  success: true,
  data: {
    keyId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...",
    privateKey: "MIIEvgIBADANBgkqhkiG9w0BAQEFAASC...",
    algorithm: "RSA-OAEP-256"
  }
};

const registerUserResponse = {
  success: true,
  data: {
    userId: "usr_f8e7d6c5-b4a3-4c2d-1e0f-9a8b7c6d5e4f",
    status: "active",
    registeredAt: "2025-12-18T10:30:00Z"
  }
};

// Mock hashed PAN (SHA-256 of card number - computed client-side)
const MOCK_HASHED_PAN = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

// Step 3 - Create Payment request/response
const createPaymentRequest = {
  version: "1.0",
  receiptId: "550e8400-e29b-41d4-a716-446655440003",
  merchantId: "550e8400-e29b-41d4-a716-446655440004",
  merchantName: "Coffee Shop",
  merchantStreet: "123 Main St",
  merchantCity: "New York",
  merchantState: "NY",
  merchantPostalCode: "10001",
  merchantCountry: "US",
  transactionId: "550e8400-e29b-41d4-a716-446655440005",
  transactionDate: "2025-12-18T12:30:00Z",
  transactionTimezone: "America/New_York",
  paymentMethod: "card",
  cardLast4: "4242",
  cardBrand: "visa",
  currency: "USD",
  subtotal: 1045,
  taxAmount: 84,
  totalAmount: 1129,
  items: [
    {
      lineItemId: "550e8400-e29b-41d4-a716-446655440006",
      name: "Latte",
      quantity: 1,
      unitPrice: 420,
      totalPrice: 420
    },
    {
      lineItemId: "550e8400-e29b-41d4-a716-446655440007",
      name: "Croissant",
      quantity: 1,
      unitPrice: 350,
      totalPrice: 350
    },
    {
      lineItemId: "550e8400-e29b-41d4-a716-446655440008",
      name: "Espresso",
      quantity: 1,
      unitPrice: 275,
      totalPrice: 275
    }
  ],
  recipientHashedPan: MOCK_HASHED_PAN,
  amount: 1129,
  cardNonce: "cnon:card-nonce-ok"
};

const createPaymentResponse = {
  success: true,
  data: {
    paymentId: "pi_stripe_abc123",
    clientSecret: "pi_stripe_abc123_secret_xyz",
    drpMetadata: {
      receiptId: "550e8400-e29b-41d4-a716-446655440003",
      transactionId: "550e8400-e29b-41d4-a716-446655440005"
    }
  }
};

// Step 4 - Grant Decrypt Access response
const grantAccessResponse = {
  success: true,
  data: {
    tokenId: "tok_9a8b7c6d-5e4f-3a2b-1c0d-e9f8a7b6c5d4",
    userId: "usr_f8e7d6c5-b4a3-4c2d-1e0f-9a8b7c6d5e4f",
    keyId: "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
    purpose: "decrypt",
    grantedAt: "2025-12-18T10:35:00Z",
    expiresAt: "2025-12-18T10:38:00Z",
    sourceIp: "192.168.1.100"
  }
};

// Step 5 - Decrypt Receipt response
const decryptReceiptResponse = {
  success: true,
  data: {
    receiptId: "550e8400-e29b-41d4-a716-446655440003",
    merchant: {
      id: "550e8400-e29b-41d4-a716-446655440004",
      name: "Coffee Shop",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "US"
      }
    },
    transaction: {
      id: "550e8400-e29b-41d4-a716-446655440005",
      date: "2025-12-18T12:30:00Z",
      timezone: "America/New_York"
    },
    payment: {
      method: "card",
      last4: "4242",
      brand: "visa"
    },
    items: [
      {
        id: "550e8400-e29b-41d4-a716-446655440006",
        name: "Latte",
        quantity: 1,
        unitPrice: 420,
        totalPrice: 420
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440007",
        name: "Croissant",
        quantity: 1,
        unitPrice: 350,
        totalPrice: 350
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440008",
        name: "Espresso",
        quantity: 1,
        unitPrice: 275,
        totalPrice: 275
      }
    ],
    summary: {
      currency: "USD",
      subtotal: 1045,
      tax: 84,
      total: 1129
    }
  }
};

export function ApiSimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepData, setStepData] = useState<StepData>({});
  const [toggleAnimating, setToggleAnimating] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [payloadHeight, setPayloadHeight] = useState(200);
  const [isDragging, setIsDragging] = useState(false);
  const [mobileTab, setMobileTab] = useState<'simulation' | 'logs'>('simulation');
  const [isSimulatorVisible, setIsSimulatorVisible] = useState(true);
  const simulatorRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  // Track simulator visibility for mobile controls
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSimulatorVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (simulatorRef.current) {
      observer.observe(simulatorRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      id: "intro",
      title: "Welcome to Vero",
      description: "This simulator walks you through the Vero API flow. Click 'Next' to begin.",
    },
    {
      id: "enable-drp",
      title: "Enable Digital Receipts",
      description: "When a user enables Vero in their banking app, the card issuer generates keys and registers the user.",
    },
    {
      id: "create-payment",
      title: "Create Payment & Encrypt Receipt",
      description: "When the user taps their card, the merchant POS creates a payment and encrypts the receipt with the consumer's public key.",
    },
    {
      id: "grant-access",
      title: "Grant Decrypt Access",
      description: "When the user wants to view a receipt, the card issuer grants temporary decrypt access.",
    },
    {
      id: "decrypt-receipt",
      title: "Decrypt Receipt",
      description: "The card issuer decrypts the receipt using the user's private key and displays the full receipt.",
    },
  ];

  const handleNext = useCallback(() => {
    if (isAnimating) return;

    const nextStep = currentStep + 1;
    if (nextStep >= steps.length) return;

    setIsAnimating(true);

    // Handle API call based on step
    if (nextStep === 1) {
      // Enable Digital Receipts step - generates keys AND registers user
      setToggleAnimating(true);

      const keyLog: ApiLog = {
        id: `log-${Date.now()}`,
        stepNumber: 1,
        endpoint: "/api/v1/onboarding/generate-keys",
        method: "POST",
        timestamp: new Date().toLocaleTimeString(),
        request: null,
        response: generateKeyPairResponse,
        description: "Generate Key Pair",
        docUrl: DOC_URLS[1],
      };

      const registerRequest = {
        hashedPan: MOCK_HASHED_PAN,
        publicKey: generateKeyPairResponse.data.publicKey,
        keyId: generateKeyPairResponse.data.keyId,
      };

      const registerLog: ApiLog = {
        id: `log-${Date.now() + 1}`,
        stepNumber: 1,
        endpoint: "/api/v1/onboarding/register",
        method: "POST",
        timestamp: new Date().toLocaleTimeString(),
        request: registerRequest,
        response: registerUserResponse,
        description: "Register User",
        docUrl: DOC_URLS[2],
      };

      setTimeout(() => {
        setLogs(prev => [...prev, keyLog, registerLog]);
        setStepData({
          keyId: generateKeyPairResponse.data.keyId,
          publicKey: generateKeyPairResponse.data.publicKey,
          privateKey: generateKeyPairResponse.data.privateKey,
          algorithm: generateKeyPairResponse.data.algorithm,
          hashedPan: MOCK_HASHED_PAN,
          userId: registerUserResponse.data.userId,
          userStatus: registerUserResponse.data.status,
          registeredAt: registerUserResponse.data.registeredAt,
        });
        setSelectedLog(registerLog);
        setCurrentStep(nextStep);
        setIsAnimating(false);
      }, 500);
    } else if (nextStep === 2) {
      // Create Payment step
      const gateway = "gateway";
      const newLog: ApiLog = {
        id: `log-${Date.now()}`,
        stepNumber: 2,
        endpoint: `/api/v1/payments/${gateway}/create`,
        method: "POST",
        timestamp: new Date().toLocaleTimeString(),
        request: createPaymentRequest,
        response: createPaymentResponse,
        description: "Create Payment & Encrypt Receipt",
        docUrl: DOC_URLS[3],
      };

      setTimeout(() => {
        setLogs(prev => [...prev, newLog]);
        setStepData(prev => ({
          ...prev,
          receiptId: createPaymentResponse.data.drpMetadata.receiptId,
          transactionId: createPaymentResponse.data.drpMetadata.transactionId,
          merchantName: createPaymentRequest.merchantName,
          subtotal: createPaymentRequest.subtotal,
          taxAmount: createPaymentRequest.taxAmount,
          totalAmount: createPaymentRequest.totalAmount,
          currency: createPaymentRequest.currency,
          items: createPaymentRequest.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          })),
          paymentId: createPaymentResponse.data.paymentId,
          gateway: gateway,
        }));
        setSelectedLog(newLog);
        setCurrentStep(nextStep);
        setIsAnimating(false);
      }, 500);
    } else if (nextStep === 3) {
      // Grant Decrypt Access step
      const grantAccessRequest = {
        userId: stepData.userId,
        keyId: stepData.keyId,
      };

      const newLog: ApiLog = {
        id: `log-${Date.now()}`,
        stepNumber: 3,
        endpoint: "/api/v1/keys/grant-access",
        method: "POST",
        timestamp: new Date().toLocaleTimeString(),
        request: grantAccessRequest,
        response: grantAccessResponse,
        description: "Grant Decrypt Access",
        docUrl: DOC_URLS[4],
      };

      setTimeout(() => {
        setLogs(prev => [...prev, newLog]);
        setStepData(prev => ({
          ...prev,
          tokenId: grantAccessResponse.data.tokenId,
          tokenPurpose: grantAccessResponse.data.purpose,
          tokenGrantedAt: grantAccessResponse.data.grantedAt,
          tokenExpiresAt: grantAccessResponse.data.expiresAt,
        }));
        setSelectedLog(newLog);
        setCurrentStep(nextStep);
        setIsAnimating(false);
      }, 500);
    } else if (nextStep === 4) {
      // Decrypt Receipt step
      const decryptReceiptRequest = {
        receiptId: stepData.receiptId,
        tokenId: stepData.tokenId,
      };

      const newLog: ApiLog = {
        id: `log-${Date.now()}`,
        stepNumber: 4,
        endpoint: "/api/v1/receipts/decrypt",
        method: "POST",
        timestamp: new Date().toLocaleTimeString(),
        request: decryptReceiptRequest,
        response: decryptReceiptResponse,
        description: "Decrypt Receipt",
        docUrl: DOC_URLS[5],
      };

      setTimeout(() => {
        setLogs(prev => [...prev, newLog]);
        setStepData(prev => ({
          ...prev,
          decryptedReceipt: {
            receiptId: decryptReceiptResponse.data.receiptId,
            merchant: {
              name: decryptReceiptResponse.data.merchant.name,
              address: decryptReceiptResponse.data.merchant.address,
            },
            transaction: {
              id: decryptReceiptResponse.data.transaction.id,
              date: decryptReceiptResponse.data.transaction.date,
            },
            payment: decryptReceiptResponse.data.payment,
            items: decryptReceiptResponse.data.items,
            summary: decryptReceiptResponse.data.summary,
          },
        }));
        setSelectedLog(newLog);
        setCurrentStep(nextStep);
        setIsAnimating(false);
      }, 500);
    } else {
      setCurrentStep(nextStep);
      setIsAnimating(false);
    }
  }, [currentStep, isAnimating, steps.length, stepData.publicKey, stepData.keyId, stepData.userId, stepData.receiptId, stepData.tokenId]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setLogs([]);
    setSelectedLog(null);
    setStepData({});
    setToggleAnimating(false);
    setSelectedTransaction(null);
  }, []);

  const handleBack = useCallback(() => {
    if (isAnimating || currentStep <= 0) return;

    // Remove the last log when going back
    setLogs(prev => prev.slice(0, -1));
    setSelectedLog(logs.length > 1 ? logs[logs.length - 2] : null);
    setCurrentStep(prev => prev - 1);

    // Reset toggle animation if going back to step 0
    if (currentStep === 1) {
      setToggleAnimating(false);
    }
  }, [isAnimating, currentStep, logs]);

  const handleLogSelect = useCallback((log: ApiLog) => {
    setSelectedLog(log);
    setCurrentStep(log.stepNumber);
    // Reset selectedTransaction when navigating to a different step
    if (log.stepNumber !== 4) {
      setSelectedTransaction(null);
    }
  }, []);

  // Generate and download receipt as PNG
  const handleDownloadReceipt = useCallback(() => {
    if (!stepData.decryptedReceipt) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 550;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, 100);

    // Merchant name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(stepData.decryptedReceipt.merchant.name, canvas.width / 2, 45);

    // Address
    ctx.fillStyle = '#64748b';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    const address = `${stepData.decryptedReceipt.merchant.address.street}, ${stepData.decryptedReceipt.merchant.address.city}, ${stepData.decryptedReceipt.merchant.address.state} ${stepData.decryptedReceipt.merchant.address.postalCode}`;
    ctx.fillText(address, canvas.width / 2, 70);

    // Date
    const date = new Date(stepData.decryptedReceipt.transaction.date).toLocaleString();
    ctx.fillText(date, canvas.width / 2, 88);

    // Divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 110);
    ctx.lineTo(canvas.width - 20, 110);
    ctx.stroke();

    // Items header
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.fillText('ITEM', 30, 135);
    ctx.textAlign = 'right';
    ctx.fillText('PRICE', canvas.width - 30, 135);

    // Items
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#0f172a';
    let yPos = 165;
    stepData.decryptedReceipt.items.forEach((item) => {
      ctx.textAlign = 'left';
      ctx.fillText(`${item.quantity}x ${item.name}`, 30, yPos);
      ctx.textAlign = 'right';
      ctx.fillText(`$${(item.totalPrice / 100).toFixed(2)}`, canvas.width - 30, yPos);
      yPos += 28;
    });

    // Divider before totals
    ctx.beginPath();
    ctx.moveTo(20, yPos + 10);
    ctx.lineTo(canvas.width - 20, yPos + 10);
    ctx.stroke();

    // Subtotal
    yPos += 40;
    ctx.fillStyle = '#64748b';
    ctx.font = '13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Subtotal', 30, yPos);
    ctx.textAlign = 'right';
    ctx.fillText(`$${(stepData.decryptedReceipt.summary.subtotal / 100).toFixed(2)}`, canvas.width - 30, yPos);

    // Tax
    yPos += 25;
    ctx.textAlign = 'left';
    ctx.fillText('Tax', 30, yPos);
    ctx.textAlign = 'right';
    ctx.fillText(`$${(stepData.decryptedReceipt.summary.tax / 100).toFixed(2)}`, canvas.width - 30, yPos);

    // Total
    yPos += 35;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Total', 30, yPos);
    ctx.textAlign = 'right';
    ctx.fillText(`$${(stepData.decryptedReceipt.summary.total / 100).toFixed(2)}`, canvas.width - 30, yPos);

    // Divider
    yPos += 25;
    ctx.beginPath();
    ctx.moveTo(20, yPos);
    ctx.lineTo(canvas.width - 20, yPos);
    ctx.stroke();

    // Payment method
    yPos += 35;
    ctx.fillStyle = '#64748b';
    ctx.font = '13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const paymentMethod = `${stepData.decryptedReceipt.payment.brand.charAt(0).toUpperCase()}${stepData.decryptedReceipt.payment.brand.slice(1)} •••• ${stepData.decryptedReceipt.payment.last4}`;
    ctx.fillText(paymentMethod, canvas.width / 2, yPos);

    // DRP Badge
    yPos += 45;
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
    ctx.fillText('Powered by Vero', canvas.width / 2, yPos);

    // Download
    const link = document.createElement('a');
    link.download = `receipt-${stepData.decryptedReceipt.receiptId.slice(0, 8)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [stepData.decryptedReceipt]);

  // Drag handlers for resizable payload (supports both mouse and touch)
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragStartHeight.current = payloadHeight;
  }, [payloadHeight]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      // Prevent scrolling while dragging on touch devices
      if ('touches' in e) {
        e.preventDefault();
      }
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      // Dragging UP (clientY decreases) = positive deltaY = drawer expands
      const deltaY = dragStartY.current - clientY;
      const newHeight = Math.max(100, Math.min(600, dragStartHeight.current + deltaY));
      setPayloadHeight(newHeight);
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging]);

  const renderLeftPanel = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="drp-sim-intro">
            <div className="drp-sim-intro-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="drp-sim-intro-title">Vero</h3>
            <p className="drp-sim-intro-desc">
              Experience the complete API flow for generating cryptographically secure digital receipts.
            </p>
            <div className="drp-sim-intro-steps">
              <button className="drp-sim-step-preview drp-sim-step-clickable" onClick={handleNext}>
                <span className="drp-sim-step-num">1</span>
                <span>Enable Digital Receipts</span>
              </button>
              <div className="drp-sim-step-preview drp-sim-step-disabled">
                <span className="drp-sim-step-num">2</span>
                <span>Create Payment & Encrypt Receipt</span>
              </div>
              <div className="drp-sim-step-preview drp-sim-step-disabled">
                <span className="drp-sim-step-num">3</span>
                <span>Grant Decrypt Access</span>
              </div>
              <div className="drp-sim-step-preview drp-sim-step-disabled">
                <span className="drp-sim-step-num">4</span>
                <span>Decrypt Receipt</span>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="drp-sim-card-issuer">
            <div className="drp-sim-app-header">
              <div className="drp-sim-app-logo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <span>Card Issuer App</span>
              </div>
            </div>

            <div className="drp-sim-settings-card">
              <div className="drp-sim-settings-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Digital Receipt Settings</span>
              </div>

              <button
                className={`drp-sim-toggle-row ${!toggleAnimating ? 'drp-sim-toggle-clickable' : ''}`}
                onClick={!toggleAnimating ? handleNext : undefined}
                disabled={toggleAnimating}
              >
                <div className="drp-sim-toggle-info">
                  <span className="drp-sim-toggle-label">Enable Digital Receipts</span>
                  <span className="drp-sim-toggle-desc">Receive itemized receipts for all purchases</span>
                </div>
                <div className={`drp-sim-toggle ${toggleAnimating ? 'drp-sim-toggle-on drp-sim-toggle-animate' : ''}`}>
                  <div className="drp-sim-toggle-knob"></div>
                </div>
              </button>

              <div className="drp-sim-key-info">
                <div className="drp-sim-key-row">
                  <span className="drp-sim-key-label">Key ID</span>
                  <code className="drp-sim-key-value">{stepData.keyId?.substring(0, 8)}...</code>
                </div>
                <div className="drp-sim-key-row">
                  <span className="drp-sim-key-label">User ID</span>
                  <code className="drp-sim-key-value">{stepData.userId?.substring(0, 12)}...</code>
                </div>
                <div className="drp-sim-key-row">
                  <span className="drp-sim-key-label">Status</span>
                  <span className="drp-sim-status-badge drp-sim-status-active">{stepData.userStatus}</span>
                </div>
              </div>
            </div>

            {toggleAnimating && (
              <div className="drp-sim-success-banner">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Keys Generated &amp; User Registered</span>
              </div>
            )}

            <div className="drp-sim-info-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>Your card is now registered with Vero. Receipts will be encrypted with your public key.</span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="drp-sim-merchant-pos">
            <div className="drp-sim-app-header">
              <div className="drp-sim-app-logo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
                <span>Merchant POS</span>
              </div>
              <span className="drp-sim-merchant-name">{stepData.merchantName}</span>
            </div>

            <div className="drp-sim-pos-terminal">
              <div className="drp-sim-terminal-screen">
                <div className="drp-sim-terminal-header">
                  <span className="drp-sim-terminal-title">Payment Complete</span>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="24" height="24" className="drp-sim-terminal-check">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className="drp-sim-terminal-items">
                  {stepData.items?.map((item, idx) => (
                    <div key={idx} className="drp-sim-terminal-item">
                      <span className="drp-sim-item-qty">{item.quantity}x</span>
                      <span className="drp-sim-item-name">{item.name}</span>
                      <span className="drp-sim-item-price">${(item.unitPrice / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="drp-sim-terminal-summary">
                  <div className="drp-sim-terminal-row">
                    <span>Subtotal</span>
                    <span>${stepData.subtotal ? (stepData.subtotal / 100).toFixed(2) : '0.00'}</span>
                  </div>
                  <div className="drp-sim-terminal-row">
                    <span>Tax</span>
                    <span>${stepData.taxAmount ? (stepData.taxAmount / 100).toFixed(2) : '0.00'}</span>
                  </div>
                </div>

                <div className="drp-sim-terminal-total">
                  <span>Total</span>
                  <span className="drp-sim-total-amount">${stepData.totalAmount ? (stepData.totalAmount / 100).toFixed(2) : '0.00'}</span>
                </div>

                <div className="drp-sim-card-used">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <span>Visa •••• 4242</span>
                </div>
              </div>

              <div className="drp-sim-receipt-badge">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Digital Receipt Sent</span>
              </div>
            </div>

            <div className="drp-sim-info-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>The receipt is encrypted with the user&apos;s public key. Only the cardholder can decrypt it.</span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="drp-sim-card-issuer">
            <div className="drp-sim-app-header">
              <div className="drp-sim-app-logo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <span>Card Issuer App</span>
              </div>
            </div>

            {!selectedTransaction ? (
              <>
                <div className="drp-sim-settings-card">
                  <div className="drp-sim-settings-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                    <span>Recent Transactions</span>
                  </div>

                  <div className="drp-sim-transaction-list">
                    <button
                      className="drp-sim-transaction-item drp-sim-transaction-has-receipt"
                      onClick={() => setSelectedTransaction('coffee-shop')}
                    >
                      <div className="drp-sim-transaction-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="drp-sim-transaction-info">
                        <span className="drp-sim-transaction-name">Coffee Shop</span>
                        <span className="drp-sim-transaction-date">Today, 12:30 PM</span>
                      </div>
                      <div className="drp-sim-transaction-amount">-$11.29</div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="drp-sim-transaction-arrow">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>

                    <button
                      className="drp-sim-transaction-item drp-sim-transaction-no-receipt"
                      onClick={() => setSelectedTransaction('grocery-store')}
                    >
                      <div className="drp-sim-transaction-icon drp-sim-transaction-icon-plain">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      </div>
                      <div className="drp-sim-transaction-info">
                        <span className="drp-sim-transaction-name">Grocery Store</span>
                        <span className="drp-sim-transaction-date">Yesterday, 3:45 PM</span>
                      </div>
                      <div className="drp-sim-transaction-amount">-$67.23</div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="drp-sim-transaction-arrow">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>

                    <button
                      className="drp-sim-transaction-item drp-sim-transaction-no-receipt"
                      onClick={() => setSelectedTransaction('gas-station')}
                    >
                      <div className="drp-sim-transaction-icon drp-sim-transaction-icon-plain">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      </div>
                      <div className="drp-sim-transaction-info">
                        <span className="drp-sim-transaction-name">Gas Station</span>
                        <span className="drp-sim-transaction-date">Dec 16, 9:15 AM</span>
                      </div>
                      <div className="drp-sim-transaction-amount">-$45.00</div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="drp-sim-transaction-arrow">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="drp-sim-info-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <span>Transactions with digital receipts show a receipt icon. Tap to view details.</span>
                </div>
              </>
            ) : selectedTransaction === 'coffee-shop' ? (
              <>
                <div className="drp-sim-settings-card">
                  <div className="drp-sim-settings-header drp-sim-header-with-back">
                    <button
                      className="drp-sim-back-btn"
                      onClick={() => setSelectedTransaction(null)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <span>Transaction Details</span>
                  </div>

                  <div className="drp-sim-transaction-detail">
                    <div className="drp-sim-transaction-detail-header">
                      <div className="drp-sim-transaction-merchant-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                        </svg>
                      </div>
                      <div className="drp-sim-transaction-detail-info">
                        <h4 className="drp-sim-transaction-detail-name">Coffee Shop</h4>
                        <p className="drp-sim-transaction-detail-location">123 Main St, New York, NY</p>
                      </div>
                    </div>

                    <div className="drp-sim-transaction-detail-amount">
                      <span className="drp-sim-amount-label">Amount</span>
                      <span className="drp-sim-amount-value">$11.29</span>
                    </div>

                    <div className="drp-sim-transaction-detail-meta">
                      <div className="drp-sim-detail-row">
                        <span className="drp-sim-detail-label">Date</span>
                        <span className="drp-sim-detail-value">Dec 18, 2025, 12:30 PM</span>
                      </div>
                      <div className="drp-sim-detail-row">
                        <span className="drp-sim-detail-label">Card</span>
                        <span className="drp-sim-detail-value">Visa •••• 4242</span>
                      </div>
                      <div className="drp-sim-detail-row">
                        <span className="drp-sim-detail-label">Status</span>
                        <span className="drp-sim-status-badge drp-sim-status-active">Complete</span>
                      </div>
                    </div>

                    <div className="drp-sim-receipt-available">
                      <div className="drp-sim-receipt-available-icon">
                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Digital Receipt Available</span>
                    </div>

                    <button
                      className="drp-sim-view-receipt-btn"
                      onClick={handleNext}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span>View Receipt</span>
                    </button>
                  </div>
                </div>

                <div className="drp-sim-info-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Clicking &quot;View Receipt&quot; grants temporary decrypt access to view itemized details.</span>
                </div>
              </>
            ) : (
              <>
                <div className="drp-sim-settings-card">
                  <div className="drp-sim-settings-header drp-sim-header-with-back">
                    <button
                      className="drp-sim-back-btn"
                      onClick={() => setSelectedTransaction(null)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <span>Transaction Details</span>
                  </div>

                  <div className="drp-sim-transaction-detail">
                    <div className="drp-sim-transaction-detail-header">
                      <div className="drp-sim-transaction-merchant-icon drp-sim-icon-plain">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                      </div>
                      <div className="drp-sim-transaction-detail-info">
                        <h4 className="drp-sim-transaction-detail-name">
                          {selectedTransaction === 'grocery-store' ? 'Grocery Store' : 'Gas Station'}
                        </h4>
                        <p className="drp-sim-transaction-detail-location">
                          {selectedTransaction === 'grocery-store' ? 'SQ*GROCERYMART' : 'GAS STN #4521'}
                        </p>
                      </div>
                    </div>

                    <div className="drp-sim-transaction-detail-amount">
                      <span className="drp-sim-amount-label">Amount</span>
                      <span className="drp-sim-amount-value">
                        {selectedTransaction === 'grocery-store' ? '$67.23' : '$45.00'}
                      </span>
                    </div>

                    <div className="drp-sim-transaction-detail-meta">
                      <div className="drp-sim-detail-row">
                        <span className="drp-sim-detail-label">Date</span>
                        <span className="drp-sim-detail-value">
                          {selectedTransaction === 'grocery-store' ? 'Dec 17, 2025, 3:45 PM' : 'Dec 16, 2025, 9:15 AM'}
                        </span>
                      </div>
                      <div className="drp-sim-detail-row">
                        <span className="drp-sim-detail-label">Card</span>
                        <span className="drp-sim-detail-value">Visa •••• 4242</span>
                      </div>
                      <div className="drp-sim-detail-row">
                        <span className="drp-sim-detail-label">Status</span>
                        <span className="drp-sim-status-badge drp-sim-status-active">Complete</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="drp-sim-info-note drp-sim-info-warning">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>No itemized receipt available. This is how most transactions appear today without Vero.</span>
                </div>
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="drp-sim-wallet">
            <div className="drp-sim-app-header drp-sim-header-with-back">
              <button
                className="drp-sim-back-btn"
                onClick={handleBack}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <div className="drp-sim-app-logo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
                <span>Digital Receipt</span>
              </div>
            </div>

            <div className="drp-sim-receipt-view">
              <div className="drp-sim-receipt-header">
                <div className="drp-sim-merchant-logo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                  </svg>
                </div>
                <div className="drp-sim-merchant-info">
                  <h4 className="drp-sim-merchant-title">{stepData.decryptedReceipt?.merchant.name}</h4>
                  <p className="drp-sim-merchant-address">
                    {stepData.decryptedReceipt?.merchant.address.street}, {stepData.decryptedReceipt?.merchant.address.city}, {stepData.decryptedReceipt?.merchant.address.state} {stepData.decryptedReceipt?.merchant.address.postalCode}
                  </p>
                </div>
                <button className="drp-sim-download-btn" title="Download Receipt" onClick={handleDownloadReceipt}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </button>
              </div>

              <div className="drp-sim-receipt-date">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span>{stepData.decryptedReceipt?.transaction.date ? new Date(stepData.decryptedReceipt.transaction.date).toLocaleString() : ''}</span>
              </div>

              <div className="drp-sim-receipt-items">
                {stepData.decryptedReceipt?.items.map((item, idx) => (
                  <div key={idx} className="drp-sim-receipt-item">
                    <div className="drp-sim-receipt-item-left">
                      <span className="drp-sim-receipt-item-qty">{item.quantity}x</span>
                      <span className="drp-sim-receipt-item-name">{item.name}</span>
                    </div>
                    <span className="drp-sim-receipt-item-price">${(item.totalPrice / 100).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="drp-sim-receipt-summary">
                <div className="drp-sim-receipt-row">
                  <span>Subtotal</span>
                  <span>${stepData.decryptedReceipt?.summary.subtotal ? (stepData.decryptedReceipt.summary.subtotal / 100).toFixed(2) : '0.00'}</span>
                </div>
                <div className="drp-sim-receipt-row">
                  <span>Tax</span>
                  <span>${stepData.decryptedReceipt?.summary.tax ? (stepData.decryptedReceipt.summary.tax / 100).toFixed(2) : '0.00'}</span>
                </div>
                <div className="drp-sim-receipt-row drp-sim-receipt-total">
                  <span>Total</span>
                  <span>${stepData.decryptedReceipt?.summary.total ? (stepData.decryptedReceipt.summary.total / 100).toFixed(2) : '0.00'}</span>
                </div>
              </div>

              <div className="drp-sim-receipt-footer">
                <div className="drp-sim-receipt-payment">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <span className="drp-sim-receipt-card">{stepData.decryptedReceipt?.payment.brand.charAt(0).toUpperCase()}{stepData.decryptedReceipt?.payment.brand.slice(1)} •••• {stepData.decryptedReceipt?.payment.last4}</span>
                </div>
              </div>
            </div>

            <div className="drp-sim-info-note drp-sim-success-note">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Receipt successfully decrypted and displayed. The flow is complete!</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderRightPanel = () => {
    return (
      <div className="drp-sim-logs">
        <div className="drp-sim-logs-header">
          <span className="drp-sim-logs-title">API Logs</span>
          <div className="drp-sim-logs-header-right">
            {logs.length > 0 && !selectedLog && (
              <button
                className="drp-sim-show-payload-btn"
                onClick={() => setSelectedLog(logs[logs.length - 1])}
              >
                Payload
              </button>
            )}
            <span className="drp-sim-logs-count">{logs.length} call{logs.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="drp-sim-logs-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p>No API calls yet</p>
            <span>Click &apos;Next&apos; to start the flow</span>
          </div>
        ) : (
          <div className="drp-sim-logs-list">
            {logs.map((log) => (
              <div key={log.id} className="drp-sim-log-wrapper">
                <button
                  className={`drp-sim-log-item ${selectedLog?.id === log.id ? 'active' : ''}`}
                  onClick={() => handleLogSelect(log)}
                >
                  <div className="drp-sim-log-header">
                    <span className={`drp-sim-log-method drp-sim-method-${log.method.toLowerCase()}`}>
                      {log.method}
                    </span>
                    <span className="drp-sim-log-endpoint">{log.endpoint}</span>
                  </div>
                  <div className="drp-sim-log-meta">
                    <span className="drp-sim-log-desc">{log.description}</span>
                    <span className="drp-sim-log-time">{log.timestamp}</span>
                  </div>
                </button>
                {log.docUrl && (
                  <a
                    href={log.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="drp-sim-doc-link"
                    title="View API documentation"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedLog && (
          <div className="drp-sim-payload">
            <div
              className={`drp-sim-payload-resize-handle ${isDragging ? 'dragging' : ''}`}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div className="drp-sim-resize-grip">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="drp-sim-payload-header">
              <span>API Payload</span>
              <button
                className="drp-sim-payload-close"
                onClick={() => setSelectedLog(null)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="drp-sim-payload-content" style={{ height: payloadHeight }}>
              <div className="drp-sim-payload-section">
                <span className="drp-sim-payload-label">Endpoint</span>
                <code>{selectedLog.method} {selectedLog.endpoint}</code>
              </div>
              {selectedLog.endpoint === "/api/v1/onboarding/generate-keys" && (
                <div className="drp-sim-payload-section drp-sim-info-notice">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="drp-sim-info-icon">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
                  </svg>
                  <span className="drp-sim-info-text">Simulated native SDK key generation</span>
                  <span className="drp-sim-info-tooltip">
                    This is a simulation to mimic the keypair generation that happens in the native SDK (iOS Secure Enclave or Android Keystore). In production, key generation occurs on-device and the private key never leaves the secure hardware.
                  </span>
                </div>
              )}
              {selectedLog.request && (
                <div className="drp-sim-payload-section">
                  <span className="drp-sim-payload-label">Request</span>
                  <pre>{JSON.stringify(selectedLog.request, null, 2)}</pre>
                </div>
              )}
              <div className="drp-sim-payload-section">
                <span className="drp-sim-payload-label">Response</span>
                <pre>{JSON.stringify(selectedLog.response, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="drp-simulator" ref={simulatorRef}>
      <div className="drp-sim-header">
        <div className="drp-sim-progress">
          <div className="drp-sim-progress-bar">
            <div
              className="drp-sim-progress-fill"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
          <span className="drp-sim-progress-text">
            {currentStep === 0 ? 'Welcome to Vero' : `Step ${currentStep} of ${steps.length - 1}: ${steps[currentStep].title}`}
          </span>
        </div>

        <div className="drp-sim-controls">
          <button
            className="drp-sim-btn drp-sim-btn-secondary"
            onClick={handleReset}
            disabled={currentStep === 0}
          >
            Reset
          </button>
          <button
            className="drp-sim-btn drp-sim-btn-secondary"
            onClick={handleBack}
            disabled={currentStep === 0 || isAnimating}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <button
            className="drp-sim-btn drp-sim-btn-primary"
            onClick={handleNext}
            disabled={currentStep >= steps.length - 1 || isAnimating}
          >
            {isAnimating ? (
              <>
                <span className="drp-sim-spinner"></span>
                Processing...
              </>
            ) : currentStep === steps.length - 1 ? (
              'Complete'
            ) : (
              <>
                Next
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="drp-sim-mobile-tabs">
        <button
          className={`drp-sim-mobile-tab ${mobileTab === 'simulation' ? 'active' : ''}`}
          onClick={() => setMobileTab('simulation')}
        >
          Simulation
        </button>
        <button
          className={`drp-sim-mobile-tab ${mobileTab === 'logs' ? 'active' : ''}`}
          onClick={() => setMobileTab('logs')}
        >
          API Logs
          {logs.length > 0 && (
            <span className="drp-sim-mobile-tab-badge">{logs.length}</span>
          )}
        </button>
      </div>

      <div className="drp-sim-grid">
        <div className={`drp-sim-panel drp-sim-left ${mobileTab === 'logs' ? 'drp-sim-mobile-hidden' : ''}`}>
          <div className="drp-sim-panel-header">
            <span className="drp-sim-panel-badge">Simulation</span>
          </div>
          {renderLeftPanel()}
        </div>

        <div className={`drp-sim-panel drp-sim-right ${mobileTab === 'simulation' ? 'drp-sim-mobile-hidden' : ''}`}>
          {renderRightPanel()}
        </div>
      </div>

      {/* Mobile Bottom Controls */}
      <div className={`drp-sim-mobile-controls ${!isSimulatorVisible ? 'drp-sim-mobile-controls-hidden' : ''}`}>
        <button
          className="drp-sim-mobile-btn drp-sim-mobile-btn-secondary"
          onClick={handleReset}
          disabled={currentStep === 0}
        >
          Reset
        </button>
        <button
          className="drp-sim-mobile-btn drp-sim-mobile-btn-secondary"
          onClick={handleBack}
          disabled={currentStep === 0 || isAnimating}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <button
          className="drp-sim-mobile-btn drp-sim-mobile-btn-primary"
          onClick={handleNext}
          disabled={currentStep >= steps.length - 1 || isAnimating}
        >
          {isAnimating ? (
            <>
              <span className="drp-sim-spinner"></span>
              Processing...
            </>
          ) : currentStep === steps.length - 1 ? (
            'Complete'
          ) : (
            <>
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
