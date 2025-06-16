import React from 'react';
import { Chip, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { getCacheInfo } from '../services/googleSheetsService';

interface DevStatusProps {
  className?: string;
}

const DevStatus: React.FC<DevStatusProps> = ({ className = '' }) => {
  const [cacheInfo, setCacheInfo] = React.useState(getCacheInfo());
  const [isVisible, setIsVisible] = React.useState(false);

  // Only show in development mode
  const isDev = import.meta.env.DEV;
  const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

  React.useEffect(() => {
    if (!isDev) return;

    // Update cache info every 5 seconds
    const interval = setInterval(() => {
      setCacheInfo(getCacheInfo());
    }, 5000);

    return () => clearInterval(interval);
  }, [isDev]);

  if (!isDev) return null;

  const toggleVisibility = () => setIsVisible(!isVisible);

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Chip
          variant="flat"
          color={useMockData ? "warning" : "success"}
          size="sm"
          startContent={
            <Icon
              icon={useMockData ? "lucide:database" : "lucide:cloud"}
              className="text-xs"
            />
          }
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={toggleVisibility}
        >
          {useMockData ? 'Mock Data' : 'Live Data'}
        </Chip>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Card className="max-w-sm shadow-lg">
        <CardBody className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Development Status</h4>
            <button
              onClick={toggleVisibility}
              className="text-default-400 hover:text-default-600 transition-colors"
            >
              <Icon icon="lucide:x" className="text-sm" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Data Source:</span>
              <Chip
                variant="flat"
                color={useMockData ? "warning" : "success"}
                size="sm"
                startContent={
                  <Icon
                    icon={useMockData ? "lucide:database" : "lucide:cloud"}
                    className="text-xs"
                  />
                }
              >
                {useMockData ? 'Mock Data' : 'Google Sheets'}
              </Chip>
            </div>

            {!useMockData && (
              <>
                <div className="flex items-center justify-between">
                  <span>Cache Status:</span>
                  <Chip
                    variant="flat"
                    color={cacheInfo.isValid ? "success" : "default"}
                    size="sm"
                    startContent={
                      <Icon
                        icon={cacheInfo.isValid ? "lucide:check" : "lucide:clock"}
                        className="text-xs"
                      />
                    }
                  >
                    {cacheInfo.isValid ? 'Valid' : 'Expired'}
                  </Chip>
                </div>

                <div className="flex items-center justify-between">
                  <span>Cached Products:</span>
                  <span className="text-default-600">{cacheInfo.productsCount}</span>
                </div>

                {cacheInfo.hasCachedData && (
                  <div className="flex items-center justify-between">
                    <span>Cache Age:</span>
                    <span className="text-default-600">
                      {Math.floor(cacheInfo.cacheAge / 1000)}s
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="flex items-center justify-between">
              <span>Environment:</span>
              <Chip
                variant="flat"
                color="primary"
                size="sm"
                startContent={<Icon icon="lucide:code" className="text-xs" />}
              >
                Development
              </Chip>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-divider">
            <p className="text-xs text-default-500">
              {useMockData
                ? 'Using mock product data for development. Set VITE_USE_MOCK_DATA=false to use Google Sheets.'
                : 'Connected to Google Sheets API. Products are cached for 5 minutes.'
              }
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DevStatus;
