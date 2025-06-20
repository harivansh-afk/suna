# 3-tier model access system including admin tier
MODEL_ACCESS_TIERS = {
    "free": [
        # Free tier gets access to basic models only
        "openrouter/deepseek/deepseek-chat",
        "openrouter/qwen/qwen3-235b-a22b",
        "openrouter/google/gemini-2.5-flash-preview-05-20",
        "anthropic/claude-3-5-haiku-latest",
    ],
    "pro_75": [
        # Pro tier gets access to all models
        "openrouter/deepseek/deepseek-chat",
        "openrouter/qwen/qwen3-235b-a22b",
        "openrouter/google/gemini-2.5-flash-preview-05-20",
        "anthropic/claude-3-5-haiku-latest",
        "anthropic/claude-3-7-sonnet-latest",
        "anthropic/claude-sonnet-4-20250514",  # Actual Sonnet 4 moved to premium tier
    ],
    "admin": [
        # Admin tier gets access to all models (same as pro but with unlimited usage)
        "openrouter/deepseek/deepseek-chat",
        "openrouter/qwen/qwen3-235b-a22b",
        "openrouter/google/gemini-2.5-flash-preview-05-20",
        "anthropic/claude-3-5-haiku-latest",
        "anthropic/claude-3-7-sonnet-latest",
        "anthropic/claude-sonnet-4-20250514",
        "openai/o3",  # Admin tier also gets access to O3
        "openai/gpt-4.1",  # Admin tier gets access to all premium models
    ],
}

# Message/run limits per subscription tier
SUBSCRIPTION_MESSAGE_LIMITS = {
    "free": 10,  # 10 messages/runs per month
    "pro_75": 150,  # 150 messages/runs per month
    "admin": 100000,  # 100,000 messages/runs per month (effectively unlimited)
}
MODEL_NAME_ALIASES = {
    # Short names to full names
    "sonnet-3.7": "anthropic/claude-3-7-sonnet-latest",
    "sonnet-3.5": "anthropic/claude-3-5-sonnet-latest",
    "sonnet-4": "anthropic/claude-sonnet-4-20250514",  # Actual Sonnet 4 model
    "haiku-3.5": "anthropic/claude-3-5-haiku-latest",
    "claude-sonnet-4": "anthropic/claude-sonnet-4-20250514",  # Updated to use actual Sonnet 4
    # "gpt-4.1": "openai/gpt-4.1-2025-04-14",  # Commented out in constants.py
    "gpt-4o": "openrouter/openai/gpt-4o",
    "gpt-4.1": "openai/gpt-4.1",
    "gpt-4.1-mini": "gpt-4.1-mini",
    "openai/o3": "openai/o3",  # Keep O3 available but not as Sonnet 4
    # "gpt-4-turbo": "openai/gpt-4-turbo",  # Commented out in constants.py
    # "gpt-4": "openai/gpt-4",  # Commented out in constants.py
    # "gemini-flash-2.5": "openrouter/google/gemini-2.5-flash-preview",  # Commented out in constants.py
    "deepseek": "openrouter/deepseek/deepseek-chat",
    # "deepseek-r1": "openrouter/deepseek/deepseek-r1",
    # "grok-3-mini": "xai/grok-3-mini-fast-beta",  # Commented out in constants.py
    "qwen3": "openrouter/qwen/qwen3-235b-a22b",  # Commented out in constants.py
    "gemini-flash-2.5": "openrouter/google/gemini-2.5-flash-preview-05-20",
    "gemini-2.5-flash:thinking": "openrouter/google/gemini-2.5-flash-preview-05-20:thinking",
    # "google/gemini-2.5-flash-preview":"openrouter/google/gemini-2.5-flash-preview",
    # "google/gemini-2.5-flash-preview:thinking":"openrouter/google/gemini-2.5-flash-preview:thinking",
    "google/gemini-2.5-pro-preview": "openrouter/google/gemini-2.5-pro-preview",
    "deepseek/deepseek-chat-v3-0324": "openrouter/deepseek/deepseek-chat-v3-0324",
    "o3": "openai/o3",
    "openrouter/openai/o3": "openai/o3",
    # Also include full names as keys to ensure they map to themselves
    # "anthropic/claude-3-7-sonnet-latest": "anthropic/claude-3-7-sonnet-latest",
    # "openai/gpt-4.1-2025-04-14": "openai/gpt-4.1-2025-04-14",  # Commented out in constants.py
    # "openai/o3": "openai/o3",
    # "openai/gpt-4-turbo": "openai/gpt-4-turbo",  # Commented out in constants.py
    # "openai/gpt-4": "openai/gpt-4",  # Commented out in constants.py
    # "openrouter/google/gemini-2.5-flash-preview": "openrouter/google/gemini-2.5-flash-preview",  # Commented out in constants.py
    # "xai/grok-3-fast-latest": "xai/grok-3-fast-latest",  # Commented out in constants.py
    # "deepseek/deepseek-chat": "openrouter/deepseek/deepseek-chat",
    # "deepseek/deepseek-r1": "openrouter/deepseek/deepseek-r1",
    # "qwen/qwen3-235b-a22b": "openrouter/qwen/qwen3-235b-a22b",
    # "xai/grok-3-mini-fast-beta": "xai/grok-3-mini-fast-beta",  # Commented out in constants.py
}
