# Importing necessary libraries
from uagents import Agent, Context
from uagents import Model
from uagents.setup import fund_agent_if_low

# Defining a model for messages
class PromptModeler(Model):
    query: str
    context_text: str
    history: str
    role: str

class Result(Model):
    prompt: str

SEED_PHRASE = "uPrompt Agent Origin 1"

# Defining the user agent
uPdf_Agent = Agent(
    name="uPrompt",
    port=7005,
    seed=SEED_PHRASE,
    endpoint=["http://127.0.0.1:7005/submit"],
)

print(f"Your agent's address is: {Agent(seed=SEED_PHRASE).address}")

fund_agent_if_low(uPdf_Agent.wallet.address())
        
# Event handler for agent startup
@uPdf_Agent.on_event('startup')
async def address(ctx: Context):
    # Logging the agent's address
    ctx.logger.info(uPdf_Agent.address)

# Handler for query given by user
@uPdf_Agent.on_query(model=PromptModeler)
async def handle_query_response(ctx: Context, sender: str, msg: PromptModeler):
    try:
        query = msg.query
        context_text = msg.context_text
        chathistory = msg.history
        role = msg.role

        prompt = f'Answer the following query. Do not exceed 150 words:\n\n Query: {query}'

        if context_text != '':
            prompt += f'### CONTEXT ### \n\n {context_text}\n\n'

        if chathistory != '':
            prompt += f'### CHAT HISTORY ### \n\n {chathistory}\n\n'

        if role:
            prompt = f'You are given the following role, answer the query following your role in less than 150 words. If no role is specified, act like a normal AI bot.\n: {role} \n\n Query: {query}'        
    except Exception as e:
        prompt = f"Failed to process the PDF: {str(e)}"
    
    ctx.logger.info(prompt)
    await ctx.send(sender, Result(prompt=prompt))

uPdf_Agent.run()