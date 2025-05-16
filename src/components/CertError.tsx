// components/CertError.tsx

'use client';

import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KNOWN_ERROR_MESSAGE_IDS } from '@/lib/sslErrors';

interface CertErrorProps {
  errorCode: string;
}

export function CertError({ errorCode }: CertErrorProps) {
  const isKnown = KNOWN_ERROR_MESSAGE_IDS.has(errorCode);

  return (
    <Card className="max-w-xl mx-auto my-10 border-red-500">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <ShieldAlert className="text-red-600 h-6 w-6" />
          <CardTitle className="text-red-600 text-xl font-bold">
            SSL Certificate Error
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          <strong>Error Code:</strong> <code>{errorCode}</code>
        </p>
        {isKnown ? (
          <p className="text-muted-foreground">
            This is a known certificate error. Please check your system clock, network, or certificate configuration.
          </p>
        ) : (
          <p className="text-muted-foreground">
            This is an unknown error code. Ensure you are using a trusted network or contact support.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
