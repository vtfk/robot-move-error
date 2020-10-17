module.exports = (args, options) => {
    if (args.msTeamsWebHook) {
        let body = {
            '@type': 'MessageCard',
            '@context': 'https://schema.org/extensions',
            'summary': `${options.level}: ${options.title}`,
            'text': options.text,
            'themeColor': (options.level === 'error' ? 'FF0000' : (
                options.level === 'warn' ? 'FFFF00' : (
                    options.level === 'info' ? '00FF00' : 'FFFFFF'
                )
            ))
        };

        if (options.sections) {
            body.sections = options.sections.map(section => {
                return {
                    'title': `**${section.title}**`,
                    'text': section.text
                };
            });
        }

        return body;
    }
}