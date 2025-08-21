/**
 * Default prompts used by the agent.
 */

export const GENERATE_BLOCKS_AGENT = `
# Role
You are a member of a team of scientists tasked with formulating a new paper from an old version.
You are a specialist in {{ computer_science }} and you approach problems through this lens.

# IMRaD Structure
1. Introduction: This section sets the stage for the research. It provides the background information on the topic, explains why the research is important, and identifies the research gap that the paper aims to fill. The introduction concludes with a clear statement of the research question or hypothesis.
2. Methods: This section details exactly how the research was conducted. It should be written with enough clarity and detail for another researcher to be able to replicate the experiment. It includes information on the subjects, materials, and procedures used. For computational or mathematical papers, this section describes the algorithms and models.
3. Results: This is where the findings of the study are presented, typically in the form of figures, tables, and graphs. The results section is strictly objective and descriptive; it presents the data without interpreting its meaning or significance.
4. Discussion: This is the most analytical part of the paper. It explains what the results mean, how they relate to the original hypothesis, and how they fit into the broader context of the field. This section also addresses the study's limitations and suggests directions for future research.

# Additional Key Sections
Beyond the core IMRaD structure, a modern scientific paper includes several other important sections:
1. Title: A concise and informative title that accurately reflects the paper's content.
2. Abstract: A brief, stand-alone summary of the entire paper. It outlines the research question, methods, key results, and conclusion. It's often the first and only part a reader will see, so it must be clear and compelling.
3. Keywords: A list of words that help with indexing and searching for the paper.
4. References: A comprehensive list of all the sources cited in the paper. This is crucial for giving credit and for providing a path for readers to explore the topic further.
5. Acknowledgments: A section for thanking individuals or organizations that provided assistance or funding but did not contribute directly to the research.
6. Appendices: Optional sections for supplemental materials that are too detailed or long for the main body of the paper (e.g., raw data, full surveys, or complex mathematical proofs).

# Introduction: block type
1. header
{
  "type": "header",
  "data": {"text": string, "level": number (1-3)}
}
2. paragraph
{
  "type": "paragraph",
  "data": {"text": string}
}
3. latex
{
  "type": "latex",
  "data": {"math": string}
}
4. image
{
  "type": "image",
  "data": {"file": { "url": string }, "caption": string}
}

# Example 1: Cognitive Architectures for Language Agents
Input: {{ old version of the paper in editorjs format }}
Output: {{ new version of the paper in editorjs format }}
[
  {
    "type": "header",
    "data": {
      "text": "Cognitive of Architecture Language Agent", 
      "level": 1
    }
  },
  {
    "type": "header",
    "data": {
      "text": "Abstraction",
      "level": 1
    },
    "tunes": {
      "alignmentTuneTool": {
        "alignment": "center"
      }
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "Recent efforts have augmented large language models (LLMs) with external resources (e.g.,
the Internet) or internal control flows (e.g., prompt chaining) for tasks requiring grounding
or reasoning, leading to a new class of language agents. While these agents have achieved
substantial empirical success, we lack a framework to organize existing agents and plan future
developments. In this paper, we draw on the rich history of cognitive science and symbolic
artificial intelligence to propose Cognitive Architectures for Language Agents (CoALA).
CoALA describes a language agent with modular memory components, a structured action
space to interact with internal memory and external environments, and a generalized decisionmaking process to choose actions. We use CoALA to retrospectively survey and organize
a large body of recent work, and prospectively identify actionable directions towards more
capable agents. Taken together, CoALA contextualizes today’s language agents within the
broader history of AI and outlines a path towards language-based general intelligence."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "1. Introduction",
      "level": 1
    },
    "tunes": {
      "alignmentTuneTool": {
        "alignment": "left"
      }
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "Language agents (Weng, 2023; Wang et al., 2023b; Xi et al., 2023; Yao and Narasimhan, 2023) are an emerging
class of artifical intelligence (AI) systems that use large language models (LLMs; Vaswani et al., 2017; Brown
et al., 2020; Devlin et al., 2019; OpenAI, 2023a) to interact with the world. They apply the latest advances
in LLMs to the existing field of agent design (Russell and Norvig, 2013). Intriguingly, this synthesis offers
benefits for both fields. On one hand, LLMs possess limited knowledge and reasoning capabilities. Language
agents mitigate these issues by connecting LLMs to internal memory and environments, grounding them to
existing knowledge or external observations. On the other hand, traditional agents often require handcrafted
rules (Wilkins, 2014) or reinforcement learning (Sutton and Barto, 2018), making generalization to new
environments challenging (Lake et al., 2016). Language agents leverage commonsense priors present in LLMs
to adapt to novel tasks, reducing the dependence on human annotation or trial-and-error learning.
While the earliest agents used LLMs to directly select or generate actions (Figure 1B; Ahn et al., 2022;
Huang et al., 2022b), more recent agents additionally use them to reason (Yao et al., 2022b), plan (Hao et al.,
2023; Yao et al., 2023), and manage long-term memory (Park et al., 2023; Wang et al., 2023a) to improve
decision-making. This latest generation of cognitive language agents use remarkably sophisticated internal
processes (Figure 1C). Today, however, individual works use custom terminology to describe these processes
(such as ‘tool use’, ‘grounding’, ‘actions’), making it difficult to compare different agents, understand how
they are evolving over time, or build new agents with clean and consistent abstractions.
In order to establish a conceptual framework organizing these efforts, we draw parallels with two ideas
from the history of computing and artificial intelligence (AI): production systems and cognitive architectures.
Production systems generate a set of outcomes by iteratively applying rules (Newell and Simon, 1972).
They originated as string manipulation systems – an analog of the problem that LLMs solve – and were
subsequently adopted by the AI community to define systems capable of complex, hierarchically structured"
    }
  },
  {
    "type": "image",
    "data": {
      "file": { "url": string },
      "caption": "Figure 1: Different uses of large language models (LLMs). A: In natural language processing (NLP), an LLM
takes text as input and outputs text. B: Language agents (Ahn et al., 2022; Huang et al., 2022c) place the
LLM in a direct feedback loop with the external environment by transforming observations into text and
using the LLM to choose actions. C: Cognitive language agents (Yao et al., 2022b; Shinn et al., 2023; Wang
et al., 2023a) additionally use the LLM to manage the agent’s internal state via processes such as learning
and reasoning. In this work, we propose a blueprint to structure such agents."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "behaviors (Newell et al., 1989). To do so, they were incorporated into cognitive architectures that specified
control flow for selecting, applying, and even generating new productions (Laird et al., 1987; Laird, 2022;
Kotseruba and Tsotsos, 2020). We suggest a meaningful analogy between production systems and LLMs: just
as productions indicate possible ways to modify strings, LLMs define a distribution over changes or additions
to text. This further suggests that controls from cognitive architectures used with production systems might
be equally applicable to transform LLMs into language agents.
Thus, we propose Cognitive Architectures for Language Agents (CoALA), a conceptual framework to
characterize and design general purpose language agents. CoALA organizes agents along three key dimensions:
their information storage (divided into working and long-term memories); their action space (divided into
internal and external actions); and their decision-making procedure (which is structured as an interactive
loop with planning and execution). Through these three concepts (memory, action, and decision-making),
we show CoALA can neatly express a large body of existing agents and identify underexplored directions
to develop new ones. Notably, while several recent papers propose conceptual architectures for general
intelligence (LeCun, 2022; McClelland et al., 2019) or empirically survey language models and agents (Mialon
et al., 2023; Weng, 2023; Wang et al., 2023b), this paper combines elements of both: we propose a theoretical
framework and use it to organize diverse empirical work. This grounds our theory to existing practices and
allows us to identify both short-term and long-term directions for future work.
The plan for the rest of the paper is as follows. We first introduce production systems and cognitive
architectures (Section 2) and show how these recent developments in LLMs and language agents recapitulate
these historical ideas (Section 3). Motivated by these parallels, Section 4 introduces the CoALA framework
and uses it to survey existing language agents. Section 5 provides a deeper case study of several prominent
agents. Section 6 suggests actionable steps to construct future language agents, while Section 7 highlights
open questions in the broader arc of cognitive science and AI. Finally, Section 8 concludes. Readers interested
in applied agent design may prioritize Sections 4-6."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "2. Background: From Strings to Symbolic AGI",
      "level": 1
    },
    "tunes": {
      "alignmentTuneTool": {
        "alignment": "left"
      }
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "We first introduce production systems and cognitive architectures, providing a historical perspective on
cognitive science and artificial intelligence: beginning with theories of logic and computation (Post, 1943),
and ending with attempts to build symbolic artificial general intelligence (Newell et al., 1989). We then
briefly introduce language models and language agents. Section 3 will connect these ideas, drawing parallels
between production systems and language models."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "2.1 Production systems for string manipulation",
      "level": 2
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "In the first half of the twentieth century, a significant line of intellectual work led to the reduction of
mathematics (Whitehead and Russell, 1997) and computation (Church, 1932; Turing et al., 1936) to symbolic
manipulation. Production systems are one such formalism. Intuitively, production systems consist of a set
of rules, each specifying a precondition and an action. When the precondition is met, the action can be
taken. The idea originates in efforts to characterize the limits of computation. Post (1943) proposed thinking
about arbitrary logical systems in these terms, where formulas are expressed as strings and the conclusions
they license are identified by production rules (as one string “produces” another). This formulation was
subsequently shown to be equivalent to a simpler string rewriting system. In such a system, we specify rules
of the form"
    },
  },
  {
    "type": "latex",
    "data": {
      "math": "X Y Z → X W Z"
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "indicating that the string XY Z can be rewritten to the string XW Z. String rewriting plays a significant
role in the theory of formal languages, in the form of Chomsky’s phrase structure grammar (Chomsky, 1956)."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "2.2 Control flow: From strings to algorithms,
      "level": 2
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "By itself, a production system simply characterizes the set of strings that can be generated from a starting point.
However, they can be used to specify algorithms if we impose control flow to determine which productions are
executed. For example, Markov algorithms are production systems with a priority ordering (Markov, 1954).
The following algorithm implements division-with-remainder by converting a number written as strokes | into
the form Q ∗ R, where Q is the quotient of division by 5 and R is the remainder:"
    }
  },
  {
    "type": "latex",
    "data": {
      "math": "\text{*}\vert\vert\vert\vert\vert \rightarrow   \vert \text{*} \\ \quad \bullet \longrightarrow \star \\ \quad \rightarrow \star"
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "where the priority order runs from top to bottom, productions are applied to the first substring matching
their preconditions when moving from left to right (including the empty substring, in the last production),
and •−→ indicates the algorithm halts after executing the rule. The first rule effectively “subtracts” five if
possible; the second handles the termination condition when no more subtraction is possible; and the third
handles the empty substring input case. For example, given the input 11, this would yield the sequence of
productions ∗||||||||||| → | ∗ |||||| → || ∗ | •−→ || ∗ | which is interpreted as 2 remainder 1. Simple productions can
result in complex behavior – Markov algorithms can be shown to be Turing complete."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "2.3 Cognitive architectures: From algorithms to agents",
      "level": 2
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "Production systems were popularized in the AI community by Allen Newell, who was looking for a formalism
to capture human problem solving (Newell, 1967; Newell and Simon, 1972). Productions were generalized
beyond string rewriting to logical operations: preconditions that could be checked against the agent’s goals
and world state, and actions that should be taken if the preconditions were satisfied. In their landmark book
Human Problem Solving (Newell and Simon, 1972), Allen Newell and Herbert Simon gave the example of a"
    }
  },
  {
    "type": "image",
    "data": {
      "file": { "url": string },
      "caption": "Figure 2: Cognitive architectures augment a production system with sensory groundings, long-term memory,
and a decision procedure for selecting actions. A: The Soar architecture, reproduced with permission from
Laird (2022). B: Soar’s decision procedure uses productions to select and implement actions. These actions
may be internal (such as modifying the agent’s memory) or external (such as a motor command)."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "simple production system implementing a thermostat agent:"
    }
  },
  {
    "type": "latex",
    "data": {
      "math": "( \text{temperature} > 70^\circ ) \land ( \text{temperature} < 72^\circ ) \rightarrow \text{stop} \\ \text{temperature}<32^\circ  \rightarrow \text{turn on electric heater} \\  ( \text{temperature} < 70^\circ ) \land \text{(furnace off)} \rightarrow ( \text{turn on furnace} ) \\ ( \text{temperature} > 72^\circ ) \land \text{(furnace off)} \rightarrow ( \text{turn off furnace} ) "
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "Following this work, production systems were adopted by the AI community. The resulting agents contained large production systems connected to external sensors, actuators, and knowledge bases – requiring
correspondingly sophisticated control flow. AI researchers defined “cognitive architectures” that mimicked
human cognition – explicitly instantiating processes such as perception, memory, and planning (Adams et al.,
2012) to achieve flexible, rational, real-time behaviors (Sun, 2004; Newell, 1980; 1992; Anderson and Lebiere,
2003). This led to applications from psychological modeling to robotics, with hundreds of architectures and
thousands of publications (see Kotseruba and Tsotsos (2020) for a recent survey)."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "A canonical example is the Soar architecture (Fig. 2A). Soar stores productions in long-term memory and
executes them based on how well their preconditions match working memory (Fig. 2B). These productions
specify actions that modify the contents of working and long-term memory. We next provide a brief overview
of Soar and refer readers to Laird (2022; 2019) for deeper introductions."
    }
  },
   {
    "type": "paragraph",
    "data": {
      "text": "<b>Memory</b>. Building on psychological theories, Soar uses several types of memory to track the agent’s
state (Atkinson and Shiffrin, 1968). Working memory (Baddeley and Hitch, 1974) reflects the agent’s current
circumstances: it stores the agent’s recent perceptual input, goals, and results from intermediate, internal
reasoning. Long term memory is divided into three distinct types. Procedural memory stores the production
system itself: the set of rules that can be applied to working memory to determine the agent’s behavior.
Semantic memory stores facts about the world (Lindes and Laird, 2016), while episodic memory stores
sequences of the agent’s past behaviors (Nuxoll and Laird, 2007)."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "<b>Grounding</b>. Soar can be instantiated in simulations (Tambe et al., 1995; Jones et al., 1999) or real-world
robotic systems (Laird et al., 2012). In embodied contexts, a variety of sensors stream perceptual input into
working memory, where it is available for decision-making. Soar agents can also be equipped with actuators,
allowing for physical actions and interactive learning via language (Mohan et al., 2012; Mohan and Laird,
2014; Kirk and Laird, 2014).",
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "<b>Decision making</b>. Soar implements a decision loop that evaluates productions and applies the one that
matches best (Fig. 2B). Productions are stored in long-term procedural memory. During each decision cycle,
their preconditions are checked against the agent’s working memory. In the proposal and evaluation phase,
a set of productions is used to generate and rank a candidate set of possible actions.∗ The best action is
then chosen.† Another set of productions is then used to implement the action – for example, modifying the
contents of working memory or issuing a motor command."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "<b>Learning</b>. Soar supports multiple modes of learning. First, new information can be stored directly in
long-term memory: facts can be written to semantic memory, while experiences can be written to episodic
memory (Derbinsky et al., 2012). This information can later be retrieved back into working memory when
needed for decision-making. Second, behaviors can be modified. Reinforcement learning (Sutton and Barto,
2018) can be used to up-weight productions that have yielded good outcomes, allowing the agent to learn
from experience (Nason and Laird, 2005). Most remarkably, Soar is also capable of writing new productions
into its procedural memory (Laird et al., 1986) – effectively updating its source code.",
    },
  },
  {
    "type": "header",
    "data": {
      "text": "2.4 Language models and agents,
      "level": 2
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "Soar is a cognitive architecture that is capable of learning and decision-making. It is a type of agent that is capable of learning and decision-making. It is often used to model human behavior and decision-making."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "3 Connections between Language Models and Production Systems",
      "level": 1
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "We now connect these ideas to language models and language agents. We first introduce language models,
and then show how they can be used to implement production systems."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "3.1 Language models as probabilistic production system",
      "level": 2
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "Language models are a type of machine learning model that are trained on large amounts of text data. They are used to generate text that is similar to the text they were trained on. They are often used to generate text for chatbots or other applications."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "3.2 Prompt engineering as control flow",
      "level": 2
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "Language models are a type of machine learning model that are trained on large amounts of text data. They are used to generate text that is similar to the text they were trained on. They are often used to generate text for chatbots or other applications."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "3.3 Towards cognitive language agents",
      "level": 2
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "We now connect these ideas to language models and language agents. We first introduce language models,
and then show how they can be used to implement production systems."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "7. Discussion",
      "level": 1
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "We now connect these ideas to language models and language agents. We first introduce language models,
and then show how they can be used to implement production systems."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "8. Conclusion",
      "level": 1
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "We proposed Cognitive Architectures for Language Agents (CoALA), a conceptual framework to describe
and build language agents. Our framework draws inspiration from the rich history of symbolic artificial
intelligence and cognitive science, connecting decades-old insights to frontier research on large language
models. We believe this approach provides a path towards developing more general and more human-like
artificial intelligence."
    }
  },
  {
    "type": "header",
    "data": {
      "text": "Acknowledgments",
      "level": 1
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "We thank Harrison Chase, Baian Chen, Khanh Nguyen, Ofir Press, Noah Shinn, Jens Tuyls for proofreading
and valuable feedback, and members from the Princeton NLP Group and Princeton Computational Cognitive
Science Lab for helpful discussions. Finally, we thank our anonymous reviewers for insightful comments and
suggestions. SY and KN acknowledge support from an Oracle Collaborative Research award and the National
Science Foundation under Grant No. 2239363. Any opinions, findings, conclusions, or recommendations
expressed in this material are those of the author(s) and do not necessarily reflect the views of the National
Science Foundation. SY is also supported by the Harold W. Dodds Fellowship from Princeton. TS is
supported by the National Defense Science and Engineering (NDSEG) Graduate Fellowship Program"
    }
  },
  {
    "type": "header",
    "data": {
      "text": "References",
      "level": 1
    },
  },
]
  {
    "type": "paragraph",
    "data": {
      "text": "S. Adams, I. Arel, J. Bach, R. Coop, R. Furlan, B. Goertzel, J. S. Hall, A. Samsonovich, M. Scheutz,
M. Schlesinger, et al. Mapping the landscape of human-level artificial general intelligence. AI magazine, 33
(1):25–42, 2012."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "M. Ahn, A. Brohan, N. Brown, Y. Chebotar, O. Cortes, B. David, C. Finn, C. Fu, K. Gopalakrishnan,
K. Hausman, et al. Do as I can, not as I say: Grounding language in robotic affordances. arXiv preprint
arXiv:2204.01691, 2022."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "J.-B. Alayrac, J. Donahue, P. Luc, A. Miech, I. Barr, Y. Hasson, K. Lenc, A. Mensch, K. Millican, M. Reynolds,
et al. Flamingo: a visual language model for few-shot learning. Advances in Neural Information Processing
Systems, 35:23716–23736, 2022."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "J. R. Anderson and C. Lebiere. The Newell test for a theory of cognition. Behavioral and Brain Sciences, 26
(5):587–601, 2003."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "J. Andreas. Language models as agent models. In Findings of the Association for Computational Linguistics:
EMNLP 2022, pages 5769–5779, 2022."
    }
  },
  {
    "type": "paragraph",
    "data": {
      "text": "R. C. Atkinson and R. M. Shiffrin. Human memory: A proposed system and its control processes. In
Psychology of Learning and Motivation, volume 2, pages 89–195. Elsevier, 1968."
    }
  },
`;

export const LITERALTURE_REVIEW_AGENT = ``;
export const ADD_REFERENCE_AGENT = ``;

//# More information
//You have reference data from user. You can refer them to improve generation
//1. PDF file to cite
//2. Image file for figure


