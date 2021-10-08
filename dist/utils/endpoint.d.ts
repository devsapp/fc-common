export declare function getEndpointFromFcDefault(): Promise<string | null>;
export declare function checkEndpoint(region: string, accountId: string, endpoint: string): boolean;
export declare function extractAccountId(endpoint: string): string | null;
export declare function extractRegion(endpoint: string): string | null;
