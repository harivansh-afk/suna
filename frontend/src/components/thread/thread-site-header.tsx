'use client';

import { Button } from "@/components/ui/button"
import { FolderOpen, PanelRightOpen, Check, X, Menu, Share2, MessageCircle, CreditCard } from "lucide-react"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState, useRef, KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { useUpdateProject } from "@/hooks/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { ShareModal } from "@/components/sidebar/share-modal"
import { useQueryClient } from "@tanstack/react-query";
import { threadKeys } from "@/hooks/react-query/threads/keys";
import { useUsageIndicator } from "@/hooks/use-usage-indicator";
import { BillingModal } from "@/components/billing/billing-modal";

interface ThreadSiteHeaderProps {
  threadId: string;
  projectId: string;
  projectName: string;
  onViewFiles: () => void;
  onToggleSidePanel: () => void;
  onProjectRenamed?: (newName: string) => void;
  isMobileView?: boolean;
  debugMode?: boolean;
}

export function SiteHeader({
  threadId,
  projectId,
  projectName,
  onViewFiles,
  onToggleSidePanel,
  onProjectRenamed,
  isMobileView,
  debugMode,
}: ThreadSiteHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(projectName)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const queryClient = useQueryClient();

  const isMobile = useIsMobile() || isMobileView
  const { setOpenMobile } = useSidebar()
  const updateProjectMutation = useUpdateProject()
  const usageData = useUsageIndicator();

  const openShareModal = () => {
    setShowShareModal(true)
  }

  const handleUpgradeClick = () => {
    setShowBillingModal(true)
  }

  const startEditing = () => {
    setEditName(projectName);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditName(projectName);
  };

  const saveNewName = async () => {
    if (editName.trim() === '') {
      setEditName(projectName);
      setIsEditing(false);
      return;
    }

    if (editName !== projectName) {
      try {
        if (!projectId) {
          toast.error('Cannot rename: Project ID is missing');
          setEditName(projectName);
          setIsEditing(false);
          return;
        }

        const updatedProject = await updateProjectMutation.mutateAsync({
          projectId,
          data: { name: editName }
        })
        if (updatedProject) {
          onProjectRenamed?.(editName);
          queryClient.invalidateQueries({ queryKey: threadKeys.project(projectId) });
        } else {
          throw new Error('Failed to update project');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to rename project';
        console.error('Failed to rename project:', errorMessage);
        toast.error(errorMessage);
        setEditName(projectName);
      }
    }

    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveNewName();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <>
      <header className={cn(
        "bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 z-20 w-full",
        isMobile && "px-2"
      )}>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenMobile(true)}
            className="h-9 w-9 mr-1"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}

        <div className="flex flex-1 items-center gap-2 px-3">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <Input
                ref={inputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={saveNewName}
                className="h-8 w-auto min-w-[180px] text-base font-medium"
                maxLength={50}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={saveNewName}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={cancelEditing}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : !projectName || projectName === 'Project' ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            <div
              className="text-base font-medium text-muted-foreground hover:text-foreground cursor-pointer flex items-center"
              onClick={startEditing}
              title="Click to rename project"
            >
              {projectName}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 pr-4">
          {/* Debug mode indicator */}
          {debugMode && (
            <div className="bg-amber-500 text-black text-xs px-2 py-0.5 rounded-md mr-2">
              Debug
            </div>
          )}

          {/* Usage Indicator */}
          {!usageData.isLoading && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 h-7 text-xs text-muted-foreground bg-muted rounded-lg shadow-sm mr-2",
                usageData.shouldShowUpgrade && "cursor-pointer hover:bg-muted/80 transition-colors"
              )}
              onClick={usageData.shouldShowUpgrade ? handleUpgradeClick : undefined}
            >
              {usageData.hasMessagesLeft ? (
                <>
                  <MessageCircle className="h-3 w-3" />
                  <span className="text-xs select-none font-medium">
                    {usageData.messagesLeft} runs remaining
                  </span>
                </>
              ) : (
                <>
                  <CreditCard className="h-3 w-3" />
                  <span className="text-xs select-none font-medium">
                    {usageData.isFreeUser ? 'Upgrade for more messages' : 'Monthly limit reached'}
                  </span>
                </>
              )}
            </div>
          )}

          {isMobile ? (
            // Mobile view - only show the side panel toggle
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidePanel}
              className="h-9 w-9 cursor-pointer"
              aria-label="Toggle computer panel"
            >
              <PanelRightOpen className="h-4 w-4" />
            </Button>
          ) : (
            // Desktop view - show all buttons with tooltips
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onViewFiles}
                    className="h-9 w-9 cursor-pointer"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Files in Task</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={openShareModal}
                    className="h-9 w-9 cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Chat</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSidePanel}
                    className="h-9 w-9 cursor-pointer"
                  >
                    <PanelRightOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Computer Preview (CMD+I)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </header>
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        threadId={threadId}
        projectId={projectId}
      />
      <BillingModal
        open={showBillingModal}
        onOpenChange={setShowBillingModal}
        returnUrl={typeof window !== 'undefined' ? window.location.href : '/'}
      />
    </>
  )
}
