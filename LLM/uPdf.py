# Importing necessary libraries
from uagents import Agent, Context
from uagents import Model
from uagents.setup import fund_agent_if_low

# Defining a model for messages
class PDFQuery(Model):
    pdf_url: str
    query: str

SEED_PHRASE = "uPdf Agent Origin 1"

# Defining the user agent
uPdf_Agent = Agent(
    name="uPdf",
    port=7001,
    seed=SEED_PHRASE,
    endpoint=["http://127.0.0.1:7001/submit"],
)

print(f"Your agent's address is: {Agent(seed=SEED_PHRASE).address}")

fund_agent_if_low(uPdf_Agent.wallet.address())

async def fetch_pdf(url):
    content = ''
    # Fetch content from url
    return content

async def extract_context_from_pdf(pdf_content):
    context = ''
    # Add context extraction
    return context
        
# Event handler for agent startup
@uPdf_Agent.on_event('startup')
async def address(ctx: Context):
    # Logging the agent's address
    ctx.logger.info(uPdf_Agent.address)

# Handler for query given by user
@uPdf_Agent.on_query(model=PDFQuery)
async def handle_query_response(ctx: Context, sender: str, msg: PDFQuery):
    try:
        # Fetch and process the PDF
        pdf_content = fetch_pdf(msg.pdf_url)
        pdf_context = extract_context_from_pdf(pdf_content)
        
        response_message = "Context found in document." if pdf_context else "Context not found in document."
        
    except Exception as e:
        response_message = f"Failed to process the PDF: {str(e)}"
    
    ctx.logger.info(response_message)
    await ctx.send(sender, PDFQuery(pdf_url=msg.pdf_url, query=response_message))

uPdf_Agent.run()