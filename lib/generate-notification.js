module.exports = (args, options) => {
    if (args.msTeamsWebHook) {
        let body = {
            '@type': 'MessageCard',
            '@context': 'https://schema.org/extensions',
            'summary': `${options.level}: ${options.summary}`,
            'text': options.text,
            'themeColor': (options.level === 'error' ? 'FF0000' : (
                options.level === 'warn' ? 'FFFF00' : (
                    options.level === 'info' ? '00FF00' : 'FFFFFF'
                )
            ))
        };

        if (options.sections) body.sections = options.sections;

        return body;
    }
}