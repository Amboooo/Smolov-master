// lib/sslErrors.ts

export const KNOWN_ERROR_MESSAGE_IDS = new Set<string>([
    "ssl-error-bad-cert-domain",
    "ssl-error-no-cypher-overlap",
    "ssl-error-bad-certificate",
    "ssl-error-unsupported-certificate-type",
    "ssl-error-unsupported-version",
    "ssl-error-revoked-cert-alert",
    "ssl-error-expired-cert-alert",
    "ssl-error-unknown-ca-alert",
    "ssl-error-access-denied-alert",
    "ssl-error-decrypt-error-alert",
    "sec-error-expired-certificate",
    "sec-error-revoked-certificate",
    "sec-error-unknown-issuer",
    "sec-error-cert-not-valid",
    "mozilla-pkix-error-self-signed-cert",
    "mozilla-pkix-error-key-pinning-failure",
    "mozilla-pkix-error-ca-cert-used-as-end-entity",
    "mozilla-pkix-error-signature-algorithm-mismatch",
    "mozilla-pkix-error-v1-cert-used-as-ca",
    // ...lägg till fler felkoder efter behov
  ]);
  